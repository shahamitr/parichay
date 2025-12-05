# AWS S3 and CloudFront Setup - Quick Reference

## S3 Bucket Setup

### 1. Create S3 Bucket via AWS Console

1. Go to S3 Console
2. Click "Create bucket"
3. Bucket name: `onetouch-bizcard-prod-assets` (must be globally unique)
4. Region: `ap-south-1` (or closest to your users)
5. Object Ownership: ACLs disabled
6. Block all public access: Enabled (we'll use CloudFront)
7. Bucket Versioning: Enabled
8. Default encryption: SSE-S3 (AES-256)
9. Click "Create bucket"

### 2. Create S3 Bucket via AWS CLI

```bash
# Create bucket
aws s3api create-bucket \
  --bucket onetouch-bizcard-prod-assets \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket onetouch-bizcard-prod-assets \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket onetouch-bizcard-prod-assets \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      },
      "BucketKeyEnabled": true
    }]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket onetouch-bizcard-prod-assets \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 3. Configure Bucket Lifecycle Policy (Optional)

```json
{
  "Rules": [
    {
      "Id": "DeleteOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 90
      }
    },
    {
      "Id": "TransitionToIA",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD_IA"
        }
      ]
    }
  ]
}
```

Apply lifecycle policy:
```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket onetouch-bizcard-prod-assets \
  --lifecycle-configuration file://lifecycle-policy.json
```

### 4. Configure CORS

Create `cors-config.json`:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://onetouchbizcard.in"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "x-amz-meta-custom-header"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Apply CORS configuration:
```bash
aws s3api put-bucket-cors \
  --bucket onetouch-bizcard-prod-assets \
  --cors-configuration file://cors-config.json
```

## IAM User Setup

### 1. Create IAM User

```bash
# Create IAM user
aws iam create-user --user-name onetouch-bizcard-app

# Create access key
aws iam create-access-key --user-name onetouch-bizcard-app
```

Save the output:
```json
{
  "AccessKey": {
    "AccessKeyId": "AKIAIOSFODNN7EXAMPLE",
    "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
  }
}
```

### 2. Create IAM Policy

Create `s3-access-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::onetouch-bizcard-prod-assets"
    },
    {
      "Sid": "ObjectAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::onetouch-bizcard-prod-assets/*"
    }
  ]
}
```

### 3. Attach Policy to User

```bash
# Create policy
aws iam create-policy \
  --policy-name OneTouch-S3-Access \
  --policy-document file://s3-access-policy.json

# Attach policy to user
aws iam attach-user-policy \
  --user-name onetouch-bizcard-app \
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/OneTouch-S3-Access
```

### 4. Test S3 Access

```bash
# Upload test file
echo "test" > test.txt
aws s3 cp test.txt s3://onetouch-bizcard-prod-assets/test.txt \
  --profile onetouch-app

# Download test file
aws s3 cp s3://onetouch-bizcard-prod-assets/test.txt downloaded.txt \
  --profile onetouch-app

# List bucket contents
aws s3 ls s3://onetouch-bizcard-prod-assets/ \
  --profile onetouch-app

# Delete test file
aws s3 rm s3://onetouch-bizcard-prod-assets/test.txt \
  --profile onetouch-app
```

## CloudFront CDN Setup

### 1. Create Origin Access Identity (OAI)

```bash
# Create OAI
aws cloudfront create-cloud-front-origin-access-identity \
  --cloud-front-origin-access-identity-config \
    CallerReference=onetouch-bizcard-$(date +%s),Comment="OneTouch BizCard OAI"
```

Save the OAI ID from the output.

### 2. Update S3 Bucket Policy for CloudFront

Create `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAI",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity OAI_ID"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::onetouch-bizcard-prod-assets/*"
    }
  ]
}
```

Apply bucket policy:
```bash
aws s3api put-bucket-policy \
  --bucket onetouch-bizcard-prod-assets \
  --policy file://bucket-policy.json
```

### 3. Create CloudFront Distribution

Create `cloudfront-config.json`:
```json
{
  "CallerReference": "onetouch-bizcard-prod",
  "Comment": "OneTouch BizCard Production CDN",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-onetouch-bizcard-prod-assets",
        "DomainName": "onetouch-bizcard-prod-assets.s3.ap-south-1.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": "origin-access-identity/cloudfront/OAI_ID"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-onetouch-bizcard-prod-assets",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 3,
      "Items": ["GET", "HEAD", "OPTIONS"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "Compress": true,
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    }
  },
  "PriceClass": "PriceClass_All",
  "ViewerCertificate": {
    "CloudFrontDefaultCertificate": true
  }
}
```

Create distribution:
```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### 4. Create CloudFront Distribution via Console

1. Go to CloudFront Console
2. Click "Create Distribution"
3. Origin Settings:
   - Origin domain: Select your S3 bucket
   - Origin access: Origin access control settings (recommended)
   - Create new OAC
4. Default Cache Behavior:
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Allowed HTTP methods: GET, HEAD, OPTIONS
   - Cache policy: CachingOptimized
   - Compress objects automatically: Yes
5. Settings:
   - Price class: Use all edge locations
   - Alternate domain name (CNAME): cdn.onetouchbizcard.in (optional)
   - Custom SSL certificate: Select ACM certificate (if using custom domain)
6. Click "Create distribution"

### 5. Configure Custom Domain (Optional)

#### Request SSL Certificate in ACM

```bash
# Request certificate (must be in us-east-1 for CloudFront)
aws acm request-certificate \
  --domain-name cdn.onetouchbizcard.in \
  --validation-method DNS \
  --region us-east-1
```

#### Add DNS Records

Add CNAME record in your DNS:
```
Type: CNAME
Name: cdn
Value: d1234567890.cloudfront.net
TTL: 300
```

#### Update CloudFront Distribution

```bash
aws cloudfront update-distribution \
  --id DISTRIBUTION_ID \
  --distribution-config file://updated-config.json
```

## Application Integration

### 1. Install AWS SDK

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Configure AWS SDK

```typescript
// lib/s3.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET!;
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN;

export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    ServerSideEncryption: 'AES256',
  });

  await s3Client.send(command);

  // Return CloudFront URL if available, otherwise S3 URL
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`;
  }
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function getFileUrl(key: string): Promise<string> {
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  // Generate presigned URL (valid for 1 hour)
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

export default s3Client;
```

### 3. Upload Example

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/s3';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique key
    const key = `uploads/${Date.now()}-${file.name}`;

    // Upload to S3
    const url = await uploadFile(key, buffer, file.type);

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

## Monitoring and Maintenance

### S3 Metrics

```bash
# Get bucket size
aws s3 ls s3://onetouch-bizcard-prod-assets --recursive --summarize

# Get object count
aws s3 ls s3://onetouch-bizcard-prod-assets --recursive | wc -l

# List large objects
aws s3 ls s3://onetouch-bizcard-prod-assets --recursive --human-readable | sort -k 3 -h -r | head -20
```

### CloudFront Metrics

```bash
# Get distribution statistics
aws cloudfront get-distribution --id DISTRIBUTION_ID

# List invalidations
aws cloudfront list-invalidations --distribution-id DISTRIBUTION_ID

# Create invalidation (clear cache)
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

### Cost Optimization

```bash
# Enable S3 Intelligent-Tiering
aws s3api put-bucket-intelligent-tiering-configuration \
  --bucket onetouch-bizcard-prod-assets \
  --id IntelligentTiering \
  --intelligent-tiering-configuration '{
    "Id": "IntelligentTiering",
    "Status": "Enabled",
    "Tierings": [
      {
        "Days": 90,
        "AccessTier": "ARCHIVE_ACCESS"
      },
      {
        "Days": 180,
        "AccessTier": "DEEP_ARCHIVE_ACCESS"
      }
    ]
  }'
```

## Troubleshooting

### Access Denied Errors

```bash
# Check bucket policy
aws s3api get-bucket-policy --bucket onetouch-bizcard-prod-assets

# Check IAM user permissions
aws iam list-attached-user-policies --user-name onetouch-bizcard-app

# Test with AWS CLI
aws s3 ls s3://onetouch-bizcard-prod-assets --profile onetouch-app
```

### CORS Errors

```bash
# Check CORS configuration
aws s3api get-bucket-cors --bucket onetouch-bizcard-prod-assets

# Update CORS configuration
aws s3api put-bucket-cors \
  --bucket onetouch-bizcard-prod-assets \
  --cors-configuration file://cors-config.json
```

### CloudFront Issues

```bash
# Check distribution status
aws cloudfront get-distribution --id DISTRIBUTION_ID

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"

# Check origin access
aws cloudfront get-cloud-front-origin-access-identity --id OAI_ID
```

## Security Best Practices

1. **Block public access**: Always block public access to S3 bucket
2. **Use CloudFront**: Serve content through CloudFront, not directly from S3
3. **Enable encryption**: Use server-side encryption (SSE-S3 or SSE-KMS)
4. **Enable versioning**: Protect against accidental deletions
5. **Use IAM roles**: Prefer IAM roles over access keys when possible
6. **Rotate access keys**: Rotate IAM access keys regularly
7. **Enable logging**: Enable S3 and CloudFront access logging
8. **Use HTTPS**: Always use HTTPS for CloudFront distributions
9. **Restrict CORS**: Only allow necessary origins in CORS configuration
10. **Monitor access**: Review CloudWatch metrics and logs regularly

## Environment Variables

```env
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="onetouch-bizcard-prod-assets"
AWS_CLOUDFRONT_DOMAIN="d1234567890.cloudfront.net"
```
