import { connectDB } from '../db/mongoose.js';
import { Application } from '../models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkApplications() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    const names = ['Crafty Minez', 'Max Tyler', 'Atharva Bandwalkar'];
    
    const applications = await Application.find({ fullName: { $in: names } });
    
    console.log('\nApplication details:');
    applications.forEach(app => {
      console.log(`\n${app.fullName}:`);
      console.log(`  Discord Username: ${app.discord}`);
      console.log(`  Discord ID: ${app.discordId || 'MISSING'}`);
      console.log(`  Email: ${app.email}`);
      console.log(`  Department: ${app.department}`);
      console.log(`  Status: ${app.status}`);
    });
    
    console.log('\n⚠️  These applications need Discord IDs added.');
    console.log('Options:');
    console.log('1. Have these users resubmit their applications');
    console.log('2. Manually add their Discord IDs to the database');
    console.log('3. Delete these old applications');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkApplications();
