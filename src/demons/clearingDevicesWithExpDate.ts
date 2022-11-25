import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";
import {injectable} from "inversify";
import {container} from "../Container";


@injectable()
export class ClearingDevicesWithExpDate {
  // runs every 5 sec
  async start() {
    setTimeout(async () => {
      const clearingDevicesWithExpDate = container.resolve(ClearingDevicesWithExpDate)
      await MyModelDevicesSchema.deleteMany({expirationDate: {$lt: new Date().toISOString()}})
      await clearingDevicesWithExpDate.start()
    }, 5000)
  }
}

