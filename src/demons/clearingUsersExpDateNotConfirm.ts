import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";
import {injectable} from "inversify";
import {myContainer} from "../types/container";


@injectable()
export class ClearingUsersExpDateNotConfirm {
  // runs every hour
  async start() {
    setTimeout(async () => {
      const clearingUsersExpDateNotConfirm = myContainer.resolve(ClearingUsersExpDateNotConfirm)
      await MyModelDevicesSchema.deleteMany(
        {$and :
          [
            {"emailConfirmation.expirationDate": {$gt: new Date().toISOString()}},
            {"emailConfirmation.isConfirmed": false}
          ]})
      await clearingUsersExpDateNotConfirm.start()
    }, 3600000)
  }
}
