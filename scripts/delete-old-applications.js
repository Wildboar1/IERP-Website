import { connectDB } from '../db/mongoose.js';
import { Application } from '../models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

async function deleteApplications() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    const names = ['Crafty Minez', 'Max Tyler', 'Atharva Bandwalkar'];
    
    console.log(`Deleting applications for: ${names.join(', ')}`);
    
    const result = await Application.deleteMany({ fullName: { $in: names } });
    
    console.log(`✓ Deleted ${result.deletedCount} applications`);
    console.log('\nThese users should now resubmit their applications to get proper Discord ID tracking.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteApplications();
