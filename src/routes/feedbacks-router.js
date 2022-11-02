"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbacksRouter = void 0;
const express_1 = require("express");
const IoCContainer_1 = require("../IoCContainer");
const input_validator_middleware_1 = require("../middlewares/input-validator-middleware");
exports.feedbacksRouter = (0, express_1.Router)({});
exports.feedbacksRouter.get('/', IoCContainer_1.ioc.feedbacksController.getAllFeedbacks.bind(IoCContainer_1.ioc.feedbacksController))
    .post('/:userId', IoCContainer_1.ioc.auth.authenticationAccessToken, input_validator_middleware_1.userIdParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.feedbacksController.createFeedback.bind(IoCContainer_1.ioc.feedbacksController));
//# sourceMappingURL=feedbacks-router.js.map