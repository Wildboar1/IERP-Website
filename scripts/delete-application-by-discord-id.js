import { connectDB } from '../db/mongoose.js';
import { Application } from '../models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

async function deleteApplicationByDiscordId() {
  const discordId = process.argv[2];
  
  if (!discordId) {
    console.error('❌ Error: Please provide a Discord ID');
    console.log('Usage: node scripts/delete-application-by-discord-id.js <DISCORD_ID>');
    process.exit(1);
  }
  
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    console.log(`\nSearching for applications with Discord ID: ${discordId}`);
    
    // First, find the application to show details
    const application = await Application.findOne({ discordId });
    
    if (!application) {
      console.log('❌ No application found for Discord ID:', discordId);
      process.exit(0);
    }
    
    console.log('\n📋 Application found:');
    console.log(`  Name: ${application.fullName}`);
    console.log(`  Email: ${application.email}`);
    console.log(`  Department: ${application.department}`);
    console.log(`  Status: ${application.status}`);
    console.log(`  Applied: ${application.appliedAt}`);
    
    // Delete the application
    const result = await Application.deleteOne({ discordId });
    
    if (result.deletedCount > 0) {
      console.log('\n✅ Successfully deleted application!');
      console.log(`   Discord ID ${discordId} can now submit a new application.`);
    } else {
      console.log('\n❌ Failed to delete application');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteApplicationByDiscordId();
