const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  let mongod;

  if (!uri) {
    // Start in-memory MongoDB for local development
    console.log('No MONGO_URI provided — starting in-memory MongoDB for development');
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
  }

  try {
    await mongoose.connect(uri, {
      // useNewUrlParser/useUnifiedTopology are default in modern mongoose
    });
    console.log("MongoDB Connected ->", uri);
  } catch (error) {
    console.error("MongoDB Error connecting to", uri, "\n", error.message);
    if (mongod) {
      try { await mongod.stop(); } catch (e) { /* ignore */ }
    }
    throw error;
  }
};

module.exports = connectDB;
