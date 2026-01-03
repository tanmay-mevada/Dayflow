// src/lib/db.ts

import mongoose from 'mongoose';

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) throw new Error('Mongo URI is not defined, hell nah!!!');

  await mongoose.connect(MONGO_URI);
  isConnected = true;

  console.log('Connected to MongoDB!!!!');
}
