/**
 * Migration Script: Add Advanced Microsite Features
 *
 * This script updates existing microsite configurations to include
 * thew advanced features while preserving existing settings.
 *
 * Usage: npx tsx scripts/migrate-advanced-features.ts
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

interface MicrositeConfig {
  sections: {
    hero?: any;
    services?: any;
    contact?: any;
    [key: string]: any;
  };
  [key: string]: any;
}

async function migrateAdvancedFeatures() {
  console.log('🚀 Starting migration for advanced microsite features...\n');

  try {
    // Fetch all branches
    const branches = await prisma.branch.findMany({
      select: {
        id: true,
        name: true,
        micrositeConfig: true,
      },
    });

    console.log(`Found ${branches.length} branches to migrate.\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const branch of branches) {
      try {
        const config = branch.micrositeConfig as MicrositeConfig;

        if (!config || !config.sections) {
          console.log(`⚠️  Skipping ${branch.name} - Invalid config structure`);
          skippedCount++;
          continue;
        }

        let needsUpdate = false;
        const updatedConfig = { ...config };

        // 1. Update Hero Section for video background support
        if (updatedConfig.sections.hero) {
          if (!updatedConfig.sections.hero.backgroundType) {
            updatedConfig.sections.hero.backgroundType = 'image';
            needsUpdate = true;
          }
          if (updatedConfig.sections.hero.animationEnabled === undefined) {
            updatedConfig.sections.hero.animationEnabled = true;
            needsUpdate = true;
          }
        }

        // 2. Update Services Section for enhanced product catalog
        if (updatedConfig.sections.services && updatedConfig.sections.services.items) {
          updatedConfig.sections.services.items = updatedConfig.sections.services.items.map((item: any) => {
            const updatedItem = { ...item };

            // Add availability if not present
            if (!updatedItem.availability) {
              updatedItem.availability = 'available';
              needsUpdate = true;
            }

            // Ensure category exists
            if (!updatedItem.category) {
              updatedItem.category = 'general';
              needsUpdate = true;
            }

            return updatedItem;
          });
        }

        // 3. Update Contact Section for appointment booking and live chat
        if (updatedConfig.sections.contact) {
          // Add appointment booking config if not present
          if (!updatedConfig.sections.contact.appointmentBooking) {
            updatedConfig.sections.contact.appointmentBooking = {
              enabled: false,
              provider: 'custom',
              availableSlots: [
                {
                  day: 'monday',
                  slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
                },
                {
                  day: 'tuesday',
                  slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
                },
                {
                  day: 'wednesday',
                  slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
                },
                {
                  day: 'thursday',
                  slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
                },
                {
                  day: 'friday',
                  slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
                },
              ],
            };
            needsUpdate = true;
          }

          // Add live chat config if not present
          if (updatedConfig.sections.contact.liveChatEnabled === undefined) {
            updatedConfig.sections.contact.liveChatEnabled = false;
            needsUpdate = true;
          }

          if (!updatedConfig.sections.contact.liveChatProvider) {
            updatedConfig.sections.contact.liveChatProvider = 'tawk';
            needsUpdate = true;
          }

          if (!updatedConfig.sections.contact.liveChatConfig) {
            updatedConfig.sections.contact.liveChatConfig = {
              widgetId: '',
            };
            needsUpdate = true;
          }
        }

        // Update the branch if changes were made
        if (needsUpdate) {
          await prisma.branch.update({
            where: { id: branch.id },
            data: {
              micrositeConfig: updatedConfig as any,
            },
          });

          console.log(`✅ Updated ${branch.name}`);
          updatedCount++;
        } else {
          console.log(`ℹ️  ${branch.name} - Already up to date`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${branch.name}:`, error);
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📝 Total: ${branches.length}`);
    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateAdvancedFeatures();
