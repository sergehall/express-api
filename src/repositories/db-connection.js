"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = void 0;
const ck = require('ckey');
const mongoose_1 = __importDefault(require("mongoose"));
const dbUrl = ck.ATLAS_URI;
const dbName = ck.DB_NAME;
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(dbUrl + "/" + dbName);
            console.log("Connected successfully to server");
        }
        catch (e) {
            console.log("Can't connection to Db");
            console.error(e);
            yield mongoose_1.default.disconnect();
        }
    });
}
exports.runDb = runDb;
// // connect MongoClient to ATLAS_URI or local
// const dbUrl = ck.ATLAS_URI
// export const client = new MongoClient(dbUrl);
//
//
// export async function runDb() {
//   try {
//     //Connect the client to the server
//     await client.connect()
//     //Establish and verify connection
//     await client.db('users').command({ping: 1})
//     console.log("Connected successfully to server")
//
//
//   } catch (e) {
//     console.log("Can't connection to Db")
//     console.error(e);
//     await client.close()
//   }
// }
//# sourceMappingURL=db-connection.js.map