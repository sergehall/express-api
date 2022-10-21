import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";


export const clearingExpDateJWT = async () => {
  // runs every 5 sec
  setTimeout(async () => {
    await MyModelDevicesSchema.deleteMany({"expirationDate": {$lt: Date.now().toString()}})
    await clearingExpDateJWT()
  }, 5000)
}