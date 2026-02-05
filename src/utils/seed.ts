import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import connectDB from '../config/dbConn';
import User from '../models/User';
import Notification from '../models/Notification';
import AuditLog from '../models/AuditLog';

async function seed() {
  try {
    await connectDB();

    // Wait until mongoose connection is ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((res) => mongoose.connection.once('open', res));
    }

    console.log('Connected to MongoDB, starting seed...');

    // Clear small sets to avoid duplicates during development
    await Notification.deleteMany({}).catch(() => {});
    await AuditLog.deleteMany({}).catch(() => {});

    // Create users with different roles
    const passwordPlain = '1234..';
    const hashed = await bcrypt.hash(passwordPlain, 10);

    const usersData = [
      {
        email: 'admin@admin.admin',
        password: hashed,
        provider: 'local',
        roles: { User: 2001, Admin: 5150 },
        refreshToken: []
      },
      {
        email: 'editor@example.com',
        password: hashed,
        provider: 'local',
        roles: { User: 2001, Editor: 1984 },
        refreshToken: []
      },
      {
        email: 'user@example.com',
        password: hashed,
        provider: 'local',
        roles: { User: 2001 },
        refreshToken: []
      }
    ];

    // Upsert users (delete existing with same emails first to avoid duplicates)
    for (const u of usersData) {
      await User.findOneAndDelete({ email: u.email });
    }

    const createdUsers: any[] = [];
    for (const u of usersData) {
      const created = await User.create(u);
      createdUsers.push(created);
      const roleKeys = created && (created as any).roles ? Object.keys((created as any).roles).join(',') : 'N/A';
      console.log(`Created user: ${created.email} (roles: ${roleKeys})`);
    }

    // Create a few broadcast notifications
    const adminUser = createdUsers.find((x) => x.email === 'admin@admin.admin');
    if (adminUser) {
      await Notification.create({
        title: 'Welcome to the system',
        message: 'This is a broadcast welcome message created by the seed script.',
        type: 'info',
        target: 'all',
        createdBy: adminUser._id,
        isReadBy: []
      });

      await Notification.create({
        title: 'Maintenance Notice',
        message: 'Planned maintenance tonight at 23:00 UTC.',
        type: 'warning',
        target: 'all',
        createdBy: adminUser._id,
        isReadBy: []
      });
    }

    // Create a few audit logs tied to users
    for (const u of createdUsers) {
      await AuditLog.create({
        userId: u._id,
        action: 'SEED_CREATE',
        resource: 'SEED',
        status: 'success',
        ipAddress: '127.0.0.1',
        userAgent: 'seed-script'
      });
    }

    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
