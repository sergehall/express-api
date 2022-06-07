import {MongoClient} from 'mongodb'
const ck = require('ckey')


// connect MongoClient to ATLAS_URI or local
const dbUrl = ck.ATLAS_URI
export const client = new MongoClient(dbUrl);


export async function runDb() {
  try {
    //Connect the client to the server
    await client.connect()
    //Establish and verify connection
    await client.db('users').command({ping: 1})
    console.log("Connected successfully to server")


  } catch (e) {
    console.log("Can't connection to Db")
    console.error(e);
    await client.close()
  }
}