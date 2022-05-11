import {MongoClient} from 'mongodb'

// const dotenv = require('dotenv')
//
// const result = dotenv.config({path: '/Users/Hall/WebstormProjects/bloggers-api/.env'})
// if (result.error) {
//   console.log(result.error)
//   throw result.error
// }
// console.log(result.parsed.ATLAS_URI)

const ck = require('ckey')

const dbUrl = ck.ATLAS_URI
export const client = new MongoClient(dbUrl);

// connect to atlas cluster
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