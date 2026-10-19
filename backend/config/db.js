import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import users from '../data/users.js';
import products from '../data/products.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

const seedInitialData = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial sample products and users...');
      await User.deleteMany();
      await Product.deleteMany();

      const createdUsers = await User.insertMany(users);
      const adminUser = createdUsers[0]._id;

      const sampleProducts = products.map((product) => {
        return { ...product, user: adminUser };
      });

      await Product.insertMany(sampleProducts);
      console.log('Database seeded successfully with demo products and credentials!');
    } else {
      // Sync curated product categories and imagery for running instances
      for (const p of products) {
        await Product.updateOne(
          { name: p.name },
          { $set: { image: p.image, category: p.category } }
        );
      }
    }
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedInitialData();
  } catch (error) {
    console.warn(`Local MongoDB server not available (${error.message}).`);
    console.log(`Spinning up an In-Memory MongoDB server for zero-configuration execution...`);
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      await seedInitialData();
    } catch (memError) {
      console.error(`In-Memory MongoDB Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
