"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const IoCContainer_1 = require("../IoCContainer");
const input_validator_middleware_1 = require("../middlewares/input-validator-middleware");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/:commentId', IoCContainer_1.ioc.auth.noneStatusAccessToken, IoCContainer_1.ioc.commentsController.getCommentById.bind(IoCContainer_1.ioc.commentsController))
    .put('/:commentId', IoCContainer_1.ioc.auth.authenticationAccessToken, IoCContainer_1.ioc.auth.compareCurrentAndCreatorComment, input_validator_middleware_1.contentCommentValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.commentsController.updateCommentsById.bind(IoCContainer_1.ioc.commentsController))
    .put('/:commentId/like-status', IoCContainer_1.ioc.auth.authenticationAccessToken, input_validator_middleware_1.likeStatusValidator, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.commentsController.likeStatusCommentId.bind(IoCContainer_1.ioc.commentsController))
    .delete('/:commentId', IoCContainer_1.ioc.auth.authenticationAccessToken, IoCContainer_1.ioc.auth.compareCurrentAndCreatorComment, IoCContainer_1.ioc.commentsController.deleteCommentsById.bind(IoCContainer_1.ioc.commentsController));
//# sourceMappingURL=comments-router.js.map