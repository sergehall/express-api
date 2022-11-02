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
exports.FeedbacksController = void 0;
class FeedbacksController {
    constructor(feedbacksService) {
        this.feedbacksService = feedbacksService;
    }
    getAllFeedbacks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allFeedbacks = yield this.feedbacksService.allFeedbacks();
            res.send(allFeedbacks);
        });
    }
    createFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userIdParams = req.params.userId;
            const userIdAuth = req.user.accountData.id;
            if (userIdParams !== userIdAuth) {
                return res.sendStatus(403);
            }
            const newFeedback = yield this.feedbacksService.sendFeedback(userIdParams, req.body.comment);
            if (newFeedback.resultCode !== 0) {
                return res.status(400).send(newFeedback.errorsMessages);
            }
            res.status(201).send(newFeedback.data);
        });
    }
}
exports.FeedbacksController = FeedbacksController;
//# sourceMappingURL=feedbacksController.js.map