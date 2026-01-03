import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Already connected to MongoDB');
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    // Set mongoose options for serverless environment
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log('✓ Connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    isConnected = false;
    throw new Error('MongoDB connection failed. Please ensure IP whitelist is configured in MongoDB Atlas.');
  }
}

export async function disconnectDB() {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnect error:', error.message);
    throw error;
  }
}
