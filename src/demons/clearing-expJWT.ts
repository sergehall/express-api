import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";


export const clearingExpDateJWT = async () => {
  // runs every 1 sec
  setTimeout(async () => {
    await MyModelDevicesSchema.deleteMany({"expirationDate": {$lt: new Date().toISOString()}})
    await clearingExpDateJWT()
  }, 1000)
}