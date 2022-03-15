require('dotenv').config();
const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'ClearFashion';
const MONGODB_COLLECTION = 'products';
const MONGODB_URI = 'mongodb+srv://Cyd:u4PJcDBmfgFRNyba@clearfashion.iunyj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

let client = null;
let database = null;

console.log("Test 1")

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }

    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME);

    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    // More details
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
    const result = await collection.insertMany(products, {'ordered': false});

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': error.result.nInserted
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async query => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};

console.log("Test 2")

/*
getDB().then(async db => {
    const products = require('../products.json');
    const collection = db.collection('products');
    const result = await collection.insertMany(products);
    console.log(result);
});
*/

const givenBrand=module.exports.givenBrand=async brand=>{
  try{
    const db=await getDB()
    const collection=db.collection(MONGODB_COLLECTION)
    const query={brand:brand}
    const res=await collection.find(query).toArray()
    return res
  }catch(err){
    console.log("Erreur givenBrand", err)
  }
}

//givenBrand("Dedicated").then(res=>console.log(res))

const lessThan=module.exports.givenBrand=async price=>{
  try{
    const db=await getDB()
    const collection=db.collection(MONGODB_COLLECTION)
    const query={price:{$lte:price}}
    const res=await collection.find(query).toArray()
    return res
  }catch(err){
    console.log("Erreur givenBrand", err)
  }
}

//lessThan(50).then(res=>console.log(res))

const sortedPrice=module.exports.givenBrand=async order=>{
  try{
    const db=await getDB()
    const collection=db.collection(MONGODB_COLLECTION)
    const query={price:order}
    const res=await collection.find().sort(query).toArray()
    return res
  }catch(err){
    console.log("Erreur givenBrand", err)
  }
}

//sortedPrice(1).then(res=>console.log(res))