import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";
import {injectable} from "inversify";
import {myContainer} from "../types/container";


@injectable()
export class ClearingDevicesWithExpDate {
  // runs every 5 sec
  async start() {
    setTimeout(async () => {
      const clearingDevicesWithExpDate = myContainer.resolve(ClearingDevicesWithExpDate)
      await MyModelDevicesSchema.deleteMany({expirationDate: {$lt: new Date().toISOString()}})
      await clearingDevicesWithExpDate.start()
    }, 5000)
  }
}

