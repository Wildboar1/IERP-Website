import { connectDB } from '../db/mongoose.js';
import { Application } from '../models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

async function resetApplications() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    const names = ['Crafty Minez', 'Max Tyler', 'Atharva Bandwalkar'];
    
    console.log(`Resetting applications for: ${names.join(', ')}`);
    
    const result = await Application.updateMany(
      { fullName: { $in: names } },
      { 
        $set: { 
          status: 'pending',
          reviewedAt: null,
          reviewedBy: null,
          reviewNotes: null
        } 
      }
    );
    
    console.log(`✓ Reset ${result.modifiedCount} applications to pending status`);
    
    // Show the updated applications
    const updated = await Application.find({ fullName: { $in: names } });
    console.log('\nUpdated applications:');
    updated.forEach(app => {
      console.log(`  - ${app.fullName}: ${app.status}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetApplications();
