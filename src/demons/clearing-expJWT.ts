import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";


export const clearingExpDateJWT = async () => {
  // runs every 5 sec
  setTimeout(async () => {
    await MyModelDevicesSchema.deleteMany({"expirationDate": {$lt: new Date().toISOString()}})
    await clearingExpDateJWT()
  }, 5000)
}