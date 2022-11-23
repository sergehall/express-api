import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";
import {ioc} from "../IoCContainer";
import {injectable} from "inversify";


@injectable()
export class ClearingDevicesWithExpDate {
  // runs every 5 sec
  async start() {
    setTimeout(async () => {
      await MyModelDevicesSchema.deleteMany({expirationDate: {$lt: new Date().toISOString()}})
      await ioc.clearingInvalidJWTFromBlackList.start()
    }, 5000)
  }
}

