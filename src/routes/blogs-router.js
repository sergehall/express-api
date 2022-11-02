"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouts = void 0;
const express_1 = require("express");
const IoCContainer_1 = require("../IoCContainer");
const input_validator_middleware_1 = require("../middlewares/input-validator-middleware");
exports.blogsRouts = (0, express_1.Router)({});
exports.blogsRouts.get('/', IoCContainer_1.ioc.blogsController.getAllBlogs.bind(IoCContainer_1.ioc.blogsController))
    .get('/:blogId/posts', input_validator_middleware_1.blogIdParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.blogsController.getAllPostsByBlog.bind(IoCContainer_1.ioc.blogsController))
    .get('/:id', input_validator_middleware_1.idParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.blogsController.findBlogById.bind(IoCContainer_1.ioc.blogsController))
    .post('/', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.nameBlogValidation, input_validator_middleware_1.youtubeUrlBlogValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.blogsController.createNewBlog.bind(IoCContainer_1.ioc.blogsController))
    .post('/:blogId/posts', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.titleBlogValidation, input_validator_middleware_1.shortDescriptionBlogValidation, input_validator_middleware_1.contentBlogValidation, input_validator_middleware_1.blogIdParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.blogsController.createNewPostByBlogId.bind(IoCContainer_1.ioc.blogsController))
    .put('/:id', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.nameBlogValidation, input_validator_middleware_1.youtubeUrlBlogValidation, input_validator_middleware_1.idParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.blogsController.updatedBlogById.bind(IoCContainer_1.ioc.blogsController))
    .delete('/:id', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.idParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.blogsController.deleteBlogById.bind(IoCContainer_1.ioc.blogsController));
//# sourceMappingURL=blogs-router.js.map