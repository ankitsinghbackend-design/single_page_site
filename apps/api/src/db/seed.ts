import { config } from 'dotenv';
// Load .env relative to the project root
config({ path: '../../.env' });
config(); // also try local if needed

import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '../config/db';
import { users, sites, landingPages, productPages, contactPages, trackOrderPages, footerConfigs } from './schema';

async function main() {
  console.log('🌱 Starting database seed...');

  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('❌ Missing ADMIN_BOOTSTRAP_EMAIL or ADMIN_BOOTSTRAP_PASSWORD in environment.');
    process.exit(1);
  }

  try {
    // 1. Check if admin user already exists
    const existingAdmins = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
    
    if (existingAdmins.length > 0) {
      console.log('✅ Admin user already exists. Skipping user creation.');
    } else {
      // 2. Create admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.insert(users).values({
        email: adminEmail,
        passwordHash: hashedPassword,
      });
      console.log('✅ Admin user created.');
    }

    // 3. Create one demo site
    const existingSites = await db.select().from(sites).where(eq(sites.slug, 'corevita')).limit(1);
    
    if (existingSites.length > 0) {
      console.log('✅ Demo site already exists. Skipping site creation.');
    } else {
      const [newSite] = await db.insert(sites).values({
        name: 'CoreVita',
        slug: 'corevita',
        description: 'Demo CoreVita Site',
        status: 'draft',
      }).returning();
      console.log(`✅ Demo site "${newSite.name}" created.`);

      // 4. Insert blank page configs
      await db.insert(landingPages).values({ siteId: newSite.id });
      await db.insert(productPages).values({ siteId: newSite.id });
      await db.insert(contactPages).values({ siteId: newSite.id });
      await db.insert(trackOrderPages).values({ siteId: newSite.id });
      await db.insert(footerConfigs).values({ siteId: newSite.id });
      
      console.log('✅ Blank page configs inserted for the demo site.');
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();
