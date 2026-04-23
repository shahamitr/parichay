# 🚀 Deploying Parichay to AWS Amplify

This guide explains how to deploy Parichay using the automated infrastructure and build scripts provided.

## 📋 Prerequisites

1.  **AWS CLI Configured**: Ensure you have run `aws configure` and have permissions to create VPCs, RDS, and ElastiCache.
2.  **Git Repository**: Your code should be pushed to a private GitHub, GitLab, or Bitbucket repository.

---

## 🏗️ Step 1: Deploy Infrastructure (VPC, RDS, Redis)

Run the automated deployment script. This will create your database and cache in the `ap-south-1` region.

```bash
chmod +x scripts/deploy-infra.sh
./scripts/deploy-infra.sh
```

> [!IMPORTANT]
> - This script will generate a random password for your database.
> - **Save the `.env.amplify` file** that is created; it contains your connection strings.
> - Deployment takes **5-10 minutes**.

---

## 🌐 Step 2: Connect to AWS Amplify

1.  Log in to the [AWS Amplify Console](https://ap-south-1.console.aws.amazon.com/amplify/home?region=ap-south-1).
2.  Click **New App** -> **Host web app**.
3.  Choose your Git provider (e.g., GitHub) and connect your repository.
4.  Select the **`main`** branch.

---

## ⚙️ Step 3: Configure Build & Environment

1.  **Build Settings**: Amplify will automatically detect the `amplify.yml` file in your repository. You don't need to change anything here.
2.  **Environment Variables**:
    - Go to **App Settings** -> **Environment variables**.
    - Click **Manage variables** and add the values from your `.env.amplify` file:
        - `DATABASE_URL` (From `.env.amplify`)
        - `REDIS_URL` (From `.env.amplify`)
        - `NEXTAUTH_SECRET` (Generate a random string)
        - `JWT_SECRET` (Generate a random string)
        - `AWS_REGION` -> `ap-south-1`
        - `NODE_ENV` -> `production`
3.  **VPC Settings (Required for Automated Migrations)**:
    - Go to **App Settings** -> **VPC Settings**.
    - Select the VPC created by the script (look for `parichay-vpc`).
    - Select the **Public Subnets** (for initial simplicity) or Private subnets if you've configured a NAT.
    - Select the Security Group `parichay-rds-sg`.

---

## 🚀 Step 4: Deploy

1.  Click **Save and deploy**.
2.  Amplify will now:
    - Provision a build environment.
    - Run `pnpm install`.
    - **Run `npx prisma migrate deploy`** to set up your database schema automatically.
    - Build your Next.js application.
    - Deploy it to a global CDN.

---

## 🔒 Security & Cost Notes

- **Free Tier**: The resources created (db.t3.micro and cache.t3.micro) are eligible for the AWS Free Tier (12 months).
- **Public Subnets**: To avoid NAT Gateway costs (~$30/month), the database is placed in a public subnet but **protected by security groups**. Only authorized services (like Amplify) should have access.
- **Passwords**: Never commit your `.env.amplify` file to Git.

---

## 🛠️ Troubleshooting

- **Migration Fails**: Ensure the `DATABASE_URL` is correct and Amplify has VPC access.
- **Build Timeout**: The first build might take longer due to `pnpm install` and database setup.
- **Redis Connection**: Ensure the `REDIS_URL` matches the cluster endpoint provided in `.env.amplify`.
