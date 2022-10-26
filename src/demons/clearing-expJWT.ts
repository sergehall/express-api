import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";
import {ioc} from "../IoCContainer";


export class ClearingExpDateJWT {
  // runs every 5 sec
  async start() {
    setTimeout(async () => {
      await MyModelDevicesSchema.deleteMany({expirationDate: {$lt: new Date().toISOString()}})
      await ioc.clearingExpDateJWT.start()
    }, 5000)
  }
}

