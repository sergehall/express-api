"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloggersRouts = void 0;
const express_1 = require("express");
const IoCContainer_1 = require("../IoCContainer");
const input_validator_middleware_1 = require("../middlewares/input-validator-middleware");
exports.bloggersRouts = (0, express_1.Router)({});
exports.bloggersRouts.get('/', IoCContainer_1.ioc.bloggersController.getAllBloggers.bind(IoCContainer_1.ioc.bloggersController))
    .post('/', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.nameValidation, input_validator_middleware_1.validatorUrl, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.bloggersController.createNewBlogger.bind(IoCContainer_1.ioc.bloggersController))
    .get('/:bloggerId', input_validator_middleware_1.bloggerIdParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.bloggersController.getBloggerById.bind(IoCContainer_1.ioc.bloggersController))
    .put('/:bloggerId', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.bloggerIdParamsValidation, input_validator_middleware_1.nameValidation, input_validator_middleware_1.validatorUrl, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.bloggersController.updateBloggerById.bind(IoCContainer_1.ioc.bloggersController))
    .delete('/', IoCContainer_1.ioc.auth.basicAuthorization, IoCContainer_1.ioc.bloggersController.deleteAllBloggers.bind(IoCContainer_1.ioc.bloggersController))
    .delete('/:bloggerId', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.bloggerIdParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.bloggersController.deleteBloggerById.bind(IoCContainer_1.ioc.bloggersController))
    .get('/:bloggerId/posts', IoCContainer_1.ioc.auth.noneStatusRefreshToken, input_validator_middleware_1.bloggerIdParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.bloggersController.getAllPostByBloggerId.bind(IoCContainer_1.ioc.bloggersController))
    .post('/:bloggerId/posts', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.bloggerIdParamsValidation, input_validator_middleware_1.titleValidation, input_validator_middleware_1.shortDescriptionValidation, input_validator_middleware_1.contentValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.bloggersController.createPostByBloggerId.bind(IoCContainer_1.ioc.bloggersController));
//# sourceMappingURL=bloggers-router.js.map