import { setServers } from "node:dns";
import { MongoClient, Db } from "mongodb";

const dbName = process.env.DB_NAME || "helpo";

let client: MongoClient | null = null;
let database: Db | null = null;

const connectDB = async (): Promise<Db> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes("your_mongodb_connection_string")) {
    throw new Error("Please add a valid MONGODB_URI to your .env file");
  }

  if (database) {
    return database;
  }

  // Fix Node.js DNS resolution
  setServers(["8.8.8.8", "8.8.4.4"]);

  client = new MongoClient(mongoUri);

  await client.connect();

  database = client.db(dbName);

  console.log("MongoDB connected successfully!");

  return database;
};

export default connectDB;