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
exports.authRouter = void 0;
const express_1 = require("express");
const IoCContainer_1 = require("../IoCContainer");
const request_ip_1 = __importDefault(require("request-ip"));
const input_validator_middleware_1 = require("../middlewares/input-validator-middleware");
const DevicesSchemaModel_1 = require("../mongoose/DevicesSchemaModel");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', input_validator_middleware_1.bodyLoginUsersAccount, input_validator_middleware_1.bodyPasswordUsersAccount, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.checkHowManyTimesUserLoginLast10sec.withSameIpLog, IoCContainer_1.ioc.auth.checkCredentialsLoginPass, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientIp = request_ip_1.default.getClientIp(req);
        const title = req.header('user-agent');
        const userId = (req.headers.userId) ? `${req.headers.userId}` : '';
        const accessToken = yield IoCContainer_1.ioc.jwtService.createUsersAccountJWT(userId);
        const refreshToken = yield IoCContainer_1.ioc.jwtService.createUsersAccountRefreshJWT(userId);
        const payload = IoCContainer_1.ioc.jwtService.jwt_decode(refreshToken);
        yield DevicesSchemaModel_1.MyModelDevicesSchema.findOneAndUpdate({ title: title, ip: clientIp, }, {
            userId: payload.userId,
            ip: clientIp,
            title: title,
            lastActiveDate: new Date(payload.iat * 1000).toISOString(),
            expirationDate: new Date(payload.exp * 1000).toISOString(),
            deviceId: payload.deviceId
        }, { upsert: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
        return res.status(200).send({
            "accessToken": accessToken
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500);
    }
}));
exports.authRouter.post('/password-recovery', IoCContainer_1.ioc.checkHowManyTimesUserLoginLast10sec.withSameIpRegEmailRes, input_validator_middleware_1.bodyEmail, input_validator_middleware_1.inputValidatorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield IoCContainer_1.ioc.usersAccountService.findUserByLoginOrEmail(email);
    if (!user) {
        const result = yield IoCContainer_1.ioc.usersAccountService.sentRecoveryCodeByEmailUserNotExist(email);
        console.log(`Resend password-recovery to email:  ${result === null || result === void 0 ? void 0 : result.email}`);
        return res.sendStatus(204);
    }
    const result = yield IoCContainer_1.ioc.usersAccountService.sentRecoveryCodeByEmailUserExist(user);
    console.log(`Resend password-recovery to email:  ${result === null || result === void 0 ? void 0 : result.accountData.email}`);
    return res.sendStatus(204);
}));
exports.authRouter.post('/new-password', IoCContainer_1.ioc.checkHowManyTimesUserLoginLast10sec.withSameIpNewPasswordReq, input_validator_middleware_1.bodyNewPassword, input_validator_middleware_1.recoveryCode, input_validator_middleware_1.inputValidatorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    const recoveryCode = req.body.recoveryCode;
    const user = yield IoCContainer_1.ioc.usersAccountService.findByConfirmationCode(recoveryCode);
    if (!user) {
        return res.status(400).send({
            errorsMessages: [{
                    message: "incorrect recoveryCode",
                    field: "recoveryCode"
                }]
        });
    }
    yield IoCContainer_1.ioc.usersAccountService.createNewPassword(newPassword, user);
    return res.sendStatus(204);
}));
exports.authRouter.post('/refresh-token', IoCContainer_1.ioc.jwtService.checkRefreshTokenInBlackListAndVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        const payload = IoCContainer_1.ioc.jwtService.jwt_decode(refreshToken);
        const clientIp = request_ip_1.default.getClientIp(req);
        const title = req.header('user-agent');
        yield IoCContainer_1.ioc.blackListRefreshTokenJWTRepository.addRefreshTokenAndUserId(refreshToken);
        const newAccessToken = yield IoCContainer_1.ioc.jwtService.updateUsersAccountAccessJWT(payload);
        const newRefreshToken = yield IoCContainer_1.ioc.jwtService.updateUsersAccountRefreshJWT(payload);
        const newPayload = IoCContainer_1.ioc.jwtService.jwt_decode(newRefreshToken);
        yield DevicesSchemaModel_1.MyModelDevicesSchema.findOneAndUpdate({ userId: payload.userId, deviceId: payload.deviceId }, {
            $set: {
                userId: payload.userId,
                ip: clientIp,
                title: title,
                lastActiveDate: new Date(newPayload.iat * 1000).toISOString(),
                expirationDate: new Date(newPayload.exp * 1000).toISOString(),
                deviceId: payload.deviceId
            }
        }, { upsert: true });
        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true });
        res.status(200).send({ accessToken: newAccessToken });
        return;
    }
    catch (e) {
        console.log(e);
        return res.status(401).send({ error: e });
    }
}));
exports.authRouter.post('/registration-confirmation', IoCContainer_1.ioc.auth.checkIpInBlackList, input_validator_middleware_1.bodyCode, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.checkHowManyTimesUserLoginLast10sec.withSameIpRegConf, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientIp = request_ip_1.default.getClientIp(req);
    const countItWithIsConnectedFalse = yield IoCContainer_1.ioc.usersAccountService.checkHowManyTimesUserLoginLastHourSentEmail(clientIp);
    if (countItWithIsConnectedFalse > 5) {
        res.status(429).send('More than 5 emails sent.');
        return;
    }
    const result = yield IoCContainer_1.ioc.usersAccountService.confirmByCodeInParams(req.body.code);
    if (result === null) {
        res.status(400).send({
            "errorsMessages": [
                {
                    message: "That code is not correct or account already confirmed",
                    field: "code"
                }
            ]
        });
        return;
    }
    res.sendStatus(204);
    return;
}));
exports.authRouter.post('/registration', IoCContainer_1.ioc.auth.checkIpInBlackList, IoCContainer_1.ioc.auth.checkoutContentType, input_validator_middleware_1.bodyLogin, input_validator_middleware_1.bodyPassword, input_validator_middleware_1.bodyEmail, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.auth.checkUserAccountNotExists, IoCContainer_1.ioc.checkHowManyTimesUserLoginLast10sec.withSameIpReg, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientIp = request_ip_1.default.getClientIp(req);
    const countItWithIsConnectedFalse = yield IoCContainer_1.ioc.usersAccountService.checkHowManyTimesUserLoginLastHourSentEmail(clientIp);
    if (countItWithIsConnectedFalse > 5) {
        res.status(403).send('5 emails were sent to confirm the code.');
        return;
    }
    const user = yield IoCContainer_1.ioc.usersAccountService.createUserRegistration(req.body.login, req.body.email, req.body.password, clientIp);
    if (user) {
        res.sendStatus(204);
        return;
    }
    res.status(400).send({
        "errorsMessages": [
            {
                message: "Error with authRouter.post('/registration'......",
                field: "some"
            }
        ]
    });
    return;
}));
exports.authRouter.post('/registration-email-resending', input_validator_middleware_1.bodyEmail, input_validator_middleware_1.inputValidatorMiddleware, IoCContainer_1.ioc.checkHowManyTimesUserLoginLast10sec.withSameIpRegEmailRes, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = req.body.email;
    const userResult = yield IoCContainer_1.ioc.usersAccountService.updateAndSentConfirmationCodeByEmail(email);
    if (userResult === null) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "Check the entered email or isConfirmed already true.",
                    "field": "email"
                }
            ]
        });
        return;
    }
    console.log(`Resend code to email:  ${(_a = userResult === null || userResult === void 0 ? void 0 : userResult.accountData) === null || _a === void 0 ? void 0 : _a.email}`);
    res.sendStatus(204);
    return;
}));
exports.authRouter.post('/logout', IoCContainer_1.ioc.jwtService.checkRefreshTokenInBlackListAndVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const payload = IoCContainer_1.ioc.jwtService.jwt_decode(refreshToken);
    yield IoCContainer_1.ioc.blackListRefreshTokenJWTRepository.addRefreshTokenAndUserId(refreshToken);
    const result = yield IoCContainer_1.ioc.securityDevicesService.deleteDeviceByDeviceIdAfterLogout(payload);
    if (result === "204") {
        return res.sendStatus(204);
    }
    return res.send({ result: result });
}));
exports.authRouter.get("/me", IoCContainer_1.ioc.auth.authenticationAccessToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        return res.status(200).send({
            email: user.accountData.email,
            login: user.accountData.login,
            userId: user.accountData.id
        });
    }
    return res.sendStatus(401);
}));
// just for me
exports.authRouter.get('/resend-registration-email', IoCContainer_1.ioc.checkHowManyTimesUserLoginLast10sec.withSameIpRegEmailRes, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const parseQueryData = yield IoCContainer_1.ioc.parseQuery.parse(req);
    const code = parseQueryData.code;
    if (code === null) {
        res.status(400).send("Query param is empty");
        return;
    }
    const user = yield IoCContainer_1.ioc.usersAccountService.findByConfirmationCode(code);
    if (user === null || !user.accountData.email) {
        res.status(400).send("Bad code or isConfirmed is true.");
        return;
    }
    const result = yield IoCContainer_1.ioc.usersAccountService.updateAndSentConfirmationCodeByEmail(user.accountData.email);
    res.send(`Resend code to email:  ${(_b = result === null || result === void 0 ? void 0 : result.accountData) === null || _b === void 0 ? void 0 : _b.email}`);
}));
exports.authRouter.get('/confirm-registration', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseQueryData = yield IoCContainer_1.ioc.parseQuery.parse(req);
    const code = parseQueryData.code;
    if (code === null) {
        res.sendStatus(400);
        return;
    }
    const result = yield IoCContainer_1.ioc.usersAccountService.confirmByCodeInParams(code);
    if (result && result.emailConfirmation.isConfirmed) {
        res.status(201).send("Email confirmed by query ?code=...");
        return;
    }
    else {
        res.sendStatus(400);
        return;
    }
}));
exports.authRouter.post('/confirm-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield IoCContainer_1.ioc.usersAccountService.confirmByEmail(req.body.confirmationCode, req.body.email);
    if (result !== null) {
        res.status(201).send("Email confirmed by email and confirmationCode.");
    }
    else {
        res.sendStatus(400);
    }
}));
exports.authRouter.get('/confirm-code/:code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield IoCContainer_1.ioc.usersAccountService.confirmByCodeInParams(req.params.code);
    if (result && result.emailConfirmation.isConfirmed) {
        res.status(201).send("Email confirmed by params confirmationCode.");
    }
    else {
        res.sendStatus(400);
    }
}));
exports.authRouter.delete('/logoutRottenCreatedAt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield IoCContainer_1.ioc.usersAccountService.deleteUserWithRottenCreatedAt();
    res.send(`Total, did not confirm registration user were deleted = ${result}`);
}));
//# sourceMappingURL=auth-router.js.map