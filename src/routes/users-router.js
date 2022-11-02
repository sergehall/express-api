"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const IoCContainer_1 = require("../IoCContainer");
const input_validator_middleware_1 = require("../middlewares/input-validator-middleware");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', IoCContainer_1.ioc.usersAccountController.getUsers.bind(IoCContainer_1.ioc.usersAccountController))
    .post('/', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.bodyLogin, input_validator_middleware_1.bodyPassword, input_validator_middleware_1.bodyEmail, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.usersAccountController.createNewUser.bind(IoCContainer_1.ioc.usersAccountController))
    .delete('/:userId', IoCContainer_1.ioc.auth.basicAuthorization, input_validator_middleware_1.userIdParamsValidation, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.usersAccountController.deleteUserById.bind(IoCContainer_1.ioc.usersAccountController));
//# sourceMappingURL=users-router.js.map