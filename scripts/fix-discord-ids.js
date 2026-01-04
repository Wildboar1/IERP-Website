import { connectDB } from '../db/mongoose.js';
import { Application } from '../models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixDiscordIds() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    // Find all applications without discordId
    const applications = await Application.find({ discordId: { $exists: false } });
    
    console.log(`Found ${applications.length} applications without discordId`);
    
    // For now, set discordId to empty string or prompt user
    // You'll need to manually update these or get the Discord ID another way
    for (const app of applications) {
      console.log(`Application: ${app.fullName} - Discord: ${app.discord} - ID: ${app._id}`);
      console.log('  This application needs a Discord ID added manually.');
    }
    
    console.log('\nTo fix these, you can either:');
    console.log('1. Delete old test applications');
    console.log('2. Manually update them in MongoDB with the correct Discord ID');
    console.log('3. Submit new applications (recommended)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDiscordIds();
