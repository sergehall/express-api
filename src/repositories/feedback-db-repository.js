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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbacksRepository = void 0;
const FeedbacksSchemaModel_1 = require("../mongoose/FeedbacksSchemaModel");
const uuid4_1 = __importDefault(require("uuid4"));
const errorsMessages_1 = require("../middlewares/errorsMessages");
class FeedbacksRepository {
    createFeedback(userId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorsArray = [];
            const foundUserId = yield FeedbacksSchemaModel_1.MyModelFeedbacks.findOne({ id: userId });
            if (!foundUserId) {
                const newFeedback = { id: userId, allFeedbacks: [{ commentId: (0, uuid4_1.default)().toString(), comment: comment }] };
                yield FeedbacksSchemaModel_1.MyModelFeedbacks.create(newFeedback);
                return {
                    data: newFeedback,
                    errorsMessages: errorsArray,
                    resultCode: 0
                };
            }
            else {
                const newFeedback = { commentId: (0, uuid4_1.default)().toString(), comment: comment };
                const updateFeedback = yield FeedbacksSchemaModel_1.MyModelFeedbacks.findOneAndUpdate({ id: userId }, { $push: { allFeedbacks: newFeedback } }, { upsert: true, returnDocument: "after", projection: { _id: false, __v: false, "allFeedbacks._id": false } });
                if (!updateFeedback) {
                    errorsArray.push(errorsMessages_1.MongoHasNotUpdated);
                    return {
                        data: null,
                        errorsMessages: errorsArray,
                        resultCode: 1
                    };
                }
                return {
                    data: updateFeedback,
                    errorsMessages: errorsArray,
                    resultCode: 0
                };
            }
        });
    }
    getAllFeedbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbacksSchemaModel_1.MyModelFeedbacks.find({}, { _id: false, __v: false, "allFeedbacks._id": false }).lean();
        });
    }
}
exports.FeedbacksRepository = FeedbacksRepository;
//# sourceMappingURL=feedback-db-repository.js.map