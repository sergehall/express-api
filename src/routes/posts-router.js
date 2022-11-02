"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouts = void 0;
const express_1 = require("express");
const input_validator_middleware_1 = require("../middlewares/input-validator-middleware");
const IoCContainer_1 = require("../IoCContainer");
exports.postsRouts = (0, express_1.Router)({});
exports.postsRouts.get('/', IoCContainer_1.ioc.auth.noneStatusAccessToken, IoCContainer_1.ioc.postsController.getAllPosts.bind(IoCContainer_1.ioc.postsController))
    .post('/', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.titleValidation, input_validator_middleware_1.shortDescriptionValidation, input_validator_middleware_1.contentValidation, input_validator_middleware_1.blogIdBodyValidator, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.postsController.createNewPost.bind(IoCContainer_1.ioc.postsController))
    .get('/:postId', IoCContainer_1.ioc.auth.noneStatusRefreshToken, input_validator_middleware_1.postIdParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.postsController.getPostById.bind(IoCContainer_1.ioc.postsController))
    .put('/:postId', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.postIdParamsValidation, input_validator_middleware_1.titleValidation, input_validator_middleware_1.shortDescriptionValidation, input_validator_middleware_1.contentValidation, input_validator_middleware_1.blogIdBodyValidator, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.postsController.updatePostById.bind(IoCContainer_1.ioc.postsController))
    .delete('/:postId', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.postIdParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.postsController.deletePostById.bind(IoCContainer_1.ioc.postsController))
    .delete('/', IoCContainer_1.ioc.auth.basicAuthorization, IoCContainer_1.ioc.postsController.deleteAllPosts.bind(IoCContainer_1.ioc.postsController))
    .get('/:postId/comments', IoCContainer_1.ioc.auth.noneStatusAccessToken, input_validator_middleware_1.postIdParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.postsController.getCommentsByPostId.bind(IoCContainer_1.ioc.postsController))
    .post('/:postId/comments', IoCContainer_1.ioc.auth.authenticationAccessToken, input_validator_middleware_1.contentCommentValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.postsController.createNewCommentByPostId.bind(IoCContainer_1.ioc.postsController))
    .put('/:postId/like-status', IoCContainer_1.ioc.auth.authenticationAccessToken, input_validator_middleware_1.postIdParamsValidation, input_validator_middleware_1.likeStatusValidator, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.postsController.likeStatusPostId.bind(IoCContainer_1.ioc.postsController));
//# sourceMappingURL=posts-router.js.map