import { MongoClient } from "mongodb";

export class DBClient {
  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
    });
    this.DATABASE_NAME = process.env.DATABASE_NAME;
  }

  async connect() {
    await this.client.connect();
  }

  db() {
    return this.client.db(this.DATABASE_NAME);
  }

  collection(collectionName = "") {
    return this.db().collection(collectionName);
  }
}
