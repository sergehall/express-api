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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearingExpDateJWT = void 0;
const DevicesSchemaModel_1 = require("../mongoose/DevicesSchemaModel");
const IoCContainer_1 = require("../IoCContainer");
class ClearingExpDateJWT {
    // runs every 5 sec
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield DevicesSchemaModel_1.MyModelDevicesSchema.deleteMany({ expirationDate: { $lt: new Date().toISOString() } });
                yield IoCContainer_1.ioc.clearingExpDateJWT.start();
            }), 5000);
        });
    }
}
exports.ClearingExpDateJWT = ClearingExpDateJWT;
//# sourceMappingURL=clearing-expJWT.js.map