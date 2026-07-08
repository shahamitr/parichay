
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBrand() {
    const brandId = 'cmj647r780000111mgjmtdqmh';

    console.log(`Checking brand ${brandId}...`);

    const brand = await prisma.brand.findUnique({
        where: { id: brandId },
        include: { users: true }
    });

    if (brand) {
        console.log('Brand found:', brand.name);
        console.log('Owner ID:', brand.ownerId);
        console.log('Users:', brand.users.map(u => ({ id: u.id, email: u.email })));
    } else {
        console.log('Brand NOT found');
    }
}

checkBrand()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
