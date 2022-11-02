"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidatorMiddleware = exports.recoveryCode = exports.bodyNewPassword = exports.likeStatusValidator = exports.idParamsValidation = exports.blogIdParamsValidation = exports.contentBlogValidation = exports.shortDescriptionBlogValidation = exports.titleBlogValidation = exports.youtubeUrlBlogValidation = exports.nameBlogValidation = exports.contentCommentValidation = exports.bodyPasswordUsersAccount = exports.bodyLoginUsersAccount = exports.bodyCode = exports.bodyEmail = exports.bodyPassword = exports.bodyLogin = exports.validatorUrl = exports.userIdParamsValidation = exports.bloggerIdParamsValidation = exports.nameValidation = exports.blogIdBodyValidator = exports.postIdParamsValidation = exports.contentValidation = exports.shortDescriptionValidation = exports.titleValidation = void 0;
const express_validator_1 = require("express-validator");
// posts and bloggers validator
exports.titleValidation = (0, express_validator_1.body)("title").trim().isLength({
    min: 1,
    max: 30
}).withMessage("title must be >1 and <30 characters.");
exports.shortDescriptionValidation = (0, express_validator_1.body)("shortDescription").trim().isLength({
    min: 1,
    max: 100
}).withMessage("shortDescription must be >1 and <100 characters.");
exports.contentValidation = (0, express_validator_1.body)("content").trim().isLength({
    min: 1,
    max: 1000
}).withMessage("content must be >1 and <1000 characters.");
exports.postIdParamsValidation = (0, express_validator_1.param)('postId').isString().withMessage("postIdParamsValidation must be string.");
exports.blogIdBodyValidator = (0, express_validator_1.body)('blogId').isString().withMessage("blogIdBodyValidator");
exports.nameValidation = (0, express_validator_1.body)("name").trim().isLength({
    min: 1,
    max: 15
}).withMessage("Name must be >1 and <15 characters.");
exports.bloggerIdParamsValidation = (0, express_validator_1.param)('bloggerId').isString().withMessage('param bloggerId must string');
exports.userIdParamsValidation = (0, express_validator_1.param)('userId').trim().isLength({
    min: 1,
    max: 50
}).withMessage("'param userId must string and >1 and <50 characters.");
const youtubeUrlRegExp = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';
exports.validatorUrl = (0, express_validator_1.body)("youtubeUrl").trim().matches(youtubeUrlRegExp).isLength({
    min: 0,
    max: 100
}).withMessage("\"youtubeUrl2 should be maxLength=100 or matched to pattern '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'");
//users validator
exports.bodyLogin = (0, express_validator_1.body)(['login']).isString().withMessage('Login must be string').isLength({
    min: 3,
    max: 10
}).withMessage("bodyLogin must be >3 and <10 characters.");
exports.bodyPassword = (0, express_validator_1.body)(['password']).trim().isString().withMessage('Password must be string').isLength({
    min: 6,
    max: 20
}).withMessage("bodyPassword must be >6 and <20 characters.");
const emailRegExp = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';
exports.bodyEmail = (0, express_validator_1.body)(['email']).matches(emailRegExp).withMessage("Email should be matched to pattern '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'");
exports.bodyCode = (0, express_validator_1.body)(['code']).trim().isString().withMessage('Code must be string');
//usersAccount
exports.bodyLoginUsersAccount = (0, express_validator_1.body)(['login']).isString().withMessage('Login must be string');
exports.bodyPasswordUsersAccount = (0, express_validator_1.body)(['password']).isString().withMessage('Password must be string');
exports.contentCommentValidation = (0, express_validator_1.body)("content").trim().isLength({
    min: 20,
    max: 300
}).withMessage("content must be >20 and <300 characters.");
// Blog
exports.nameBlogValidation = (0, express_validator_1.body)("name").trim().isString();
exports.youtubeUrlBlogValidation = (0, express_validator_1.body)("youtubeUrl").trim().isString();
exports.titleBlogValidation = (0, express_validator_1.body)("title").trim().isString().isLength({
    min: 1,
    max: 30
}).withMessage("title must be >1 and <30 characters.");
exports.shortDescriptionBlogValidation = (0, express_validator_1.body)("shortDescription").trim().isLength({
    min: 1,
    max: 100
}).withMessage("shortDescription must be >1 and <1000 characters.");
exports.contentBlogValidation = (0, express_validator_1.body)("content").trim().isLength({
    min: 1,
    max: 1000
}).withMessage("content must be >1 and <1000 characters.");
exports.blogIdParamsValidation = (0, express_validator_1.param)('blogId').isString().withMessage("blogIdParamsValidation5");
exports.idParamsValidation = (0, express_validator_1.param)('id').isString();
exports.likeStatusValidator = (0, express_validator_1.check)('likeStatus').isIn(["None", "Like", "Dislike"]);
exports.bodyNewPassword = (0, express_validator_1.body)(['newPassword']).trim().isString().withMessage('newPassword must be string').isLength({
    min: 6,
    max: 20
}).withMessage("bodyPassword must be >6 and <20 characters.");
exports.recoveryCode = (0, express_validator_1.body)(['recoveryCode']).trim().isString().withMessage('recoveryCode must be string').isLength({
    min: 1,
    max: 2000
}).withMessage("recoveryCode must be >1 and <2000 characters.");
const inputValidatorMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorsMessages: errors.array().map(e => {
                return {
                    message: e.msg,
                    field: e.param
                };
            })
        });
    }
    else {
        next();
    }
};
exports.inputValidatorMiddleware = inputValidatorMiddleware;
//# sourceMappingURL=input-validator-middleware.js.map