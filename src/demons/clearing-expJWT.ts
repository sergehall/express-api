import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";


export const clearingExpDateJWT = async () => {
  // runs every 5 sec
  setTimeout(async () => {
    const currentDate = new Date().toISOString()
    await MyModelDevicesSchema.deleteMany({"expirationDate": {$lt: currentDate}})
    await clearingExpDateJWT()
  }, 5000)
}