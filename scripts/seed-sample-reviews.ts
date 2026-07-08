import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function seedSampleReviews() {
  console.log('🌱 Seeding sample reviews...');

  try {
    // Get some branches to add reviews to
    const branches = await prisma.branch.findMany({
      include: { brand: true },
      take: 5, // Just seed for first 5 branches
    });

    if (branches.length === 0) {
      console.log('No branches found. Please run the main seed script first.');
      return;
    }

    const sampleReviews = [
      {
        rating: 5,
        title: 'Excellent Service!',
        comment: 'Outstanding experience! The team was professional, friendly, and delivered exactly what they promised. Highly recommend!',
        reviewerName: 'Priya Sharma',
        reviewerEmail: 'priya.sharma@email.com',
        isVerified: true,
        isPublished: true,
        source: 'google',
      },
      {
        rating: 4,
        title: 'Great quality work',
        comment: 'Very satisfied with the service quality. The staff was knowledgeable and helpful. Will definitely come back.',
        reviewerName: 'Rajesh Kumar',
        reviewerEmail: 'rajesh.k@email.com',
        isVerified: true,
        isPublished: true,
        source: 'internal',
      },
      {
        rating: 5,
        title: 'Highly recommended',
        comment: 'Fantastic experience from start to finish. Professional service, great communication, and excellent results.',
        reviewerName: 'Anita Desai',
        reviewerEmail: 'anita.desai@email.com',
        isVerified: true,
        isPublished: true,
        source: 'facebook',
      },
      {
        rating: 3,
        title: 'Good but could be better',
        comment: 'The service was okay, but there is room for improvement in terms of response time and communication.',
        reviewerName: 'Vikram Singh',
        reviewerEmail: 'vikram.singh@email.com',
        isVerified: false,
        isPublished: true,
        source: 'internal',
      },
      {
        rating: 2,
        title: 'Disappointing experience',
        comment: 'Expected better service based on reviews. The staff seemed rushed and the quality was not up to the mark.',
        reviewerName: 'Meera Patel',
        reviewerEmail: 'meera.patel@email.com',
        isVerified: true,
        isPublished: false, // This one is not published yet
        source: 'google',
      },
      {
        rating: 5,
        title: 'Amazing team!',
        comment: 'The entire team was incredibly helpful and professional. They went above and beyond to ensure customer satisfaction.',
        reviewerName: 'Arjun Mehta',
        reviewerEmail: 'arjun.mehta@email.com',
        isVerified: true,
        isPublished: true,
        source: 'justdial',
      },
    ];

    for (const branch of branches) {
      console.log(`Adding reviews for: ${branch.name}`);

      // Add 3-4 random reviews per branch
      const reviewsToAdd = sampleReviews.slice(0, Math.floor(Math.random() * 3) + 3);

      for (const reviewData of reviewsToAdd) {
        await prisma.review.create({
          data: {
            ...reviewData,
            branchId: branch.id,
            brandId: branch.brandId,
            helpfulCount: Math.floor(Math.random() * 10),
          },
        });
      }

      console.log(`  ✅ Added ${reviewsToAdd.length} reviews`);
    }

    console.log('🎉 Sample reviews seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding sample reviews:', error);
    throw error;
  }
}

// Run the seed function
seedSampleReviews()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });