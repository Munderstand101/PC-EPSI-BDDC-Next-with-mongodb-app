// lib/mongodbService.js
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

async function connectToDatabase() {
    const client = new MongoClient(uri, options);

    try {
        await client.connect();
        return client.db("sample_mflix");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

async function findDocuments(collectionName, query = {}, limit = 10) {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    return collection.find(query).limit(limit).toArray();
}

async function findOneDocument(collectionName, query) {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    return collection.findOne(query);
}

async function insertDocument(collectionName, document) {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    return collection.insertOne(document);
}

async function updateDocument(collectionName, query, update) {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);

    try {
        const result = await collection.updateOne(query, update);
        console.log("Update Result:", result);
        return result;
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}


async function deleteDocument(collectionName, query) {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    return collection.deleteOne(query);
}

export {
    ObjectId,
    connectToDatabase,
    findDocuments,
    findOneDocument,
    insertDocument,
    updateDocument,
    deleteDocument,
};
