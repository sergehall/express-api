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
exports.Auth = void 0;
const IoCContainer_1 = require("../IoCContainer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const request_ip_1 = __importDefault(require("request-ip"));
const base64 = require('base-64');
class Auth {
    authenticationAccessToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.headers.authorization) {
                res.sendStatus(401);
                return;
            }
            const token = req.headers.authorization.split(' ')[1]; // "bearer jdgjkad.jajgdj.jksadgj"
            const userId = yield IoCContainer_1.ioc.jwtService.verifyAccessJWT(token);
            if (!userId) {
                res.sendStatus(401);
                return;
            }
            req.user = yield IoCContainer_1.ioc.usersAccountService.findUserByUserId(userId);
            next();
        });
    }
    noneStatusRefreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.cookies.refreshToken) {
                next();
                return;
            }
            const userId = yield IoCContainer_1.ioc.jwtService.verifyRefreshJWT(req.cookies.refreshToken);
            if (!userId) {
                next();
                return;
            }
            req.user = yield IoCContainer_1.ioc.usersAccountService.findUserByUserId(userId);
            next();
            return;
        });
    }
    noneStatusAccessToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.headers.authorization) {
                next();
                return;
            }
            const userId = yield IoCContainer_1.ioc.jwtService.verifyAccessJWT(req.headers.authorization.split(" ")[1]);
            if (!userId) {
                next();
                return;
            }
            req.user = yield IoCContainer_1.ioc.usersAccountService.findUserByUserId(userId);
            next();
            return;
        });
    }
    basicAuthorization(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expectedAuthHeaderValue = "Basic " + base64.encode("admin:qwerty");
                if (req.headers.authorization !== expectedAuthHeaderValue) {
                    return res.sendStatus(401);
                }
                next();
            }
            catch (e) {
                res.sendStatus(401);
            }
        });
    }
    checkoutContentType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.headers['content-type'] === 'application/json') {
                next();
                return;
            }
            res.status(400).send('Bad content type');
            return;
        });
    }
    checkCredentialsLoginPass(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield IoCContainer_1.ioc.usersAccountService.findUserByLoginOrEmail(req.body.login);
            if (user) {
                const compare = yield bcrypt_1.default.compare(req.body.password, user.accountData.passwordHash);
                if (compare) {
                    req.headers.userId = `${user.accountData.id}`;
                    next();
                    return;
                }
            }
            return res.status(401).send({
                errorsMessages: [
                    {
                        message: "Login or password is wrong!",
                        field: "Login or Password"
                    }
                ]
            });
        });
    }
    checkUserAccountNotExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkOutEmailInDB = yield IoCContainer_1.ioc.usersAccountService.findByLoginAndEmail(req.body.email, req.body.login);
            if (!checkOutEmailInDB) {
                next();
                return;
            }
            res.status(400).send({
                errorsMessages: [{
                        message: "Account already exist.",
                        field: "login, email"
                    }]
            });
            return;
        });
    }
    checkIpInBlackList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientIp = request_ip_1.default.getClientIp(req);
            if (clientIp) {
                const result = yield IoCContainer_1.ioc.blackListIPRepository.checkoutIPinBlackList(clientIp);
                if (result === null) {
                    return res.status(400).send('Black list IP1'); // need thinks
                }
                next();
                return;
            }
            return res.status(400).send('Bad IP2'); // need thinks
        });
    }
    compareCurrentAndCreatorComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userLogin = req.user.accountData.login;
                const userId = req.user.accountData.id;
                const commentId = req.params.commentId;
                const filter = { "allComments.id": commentId };
                const foundPostWithComments = yield IoCContainer_1.ioc.commentsService.findCommentInDB(filter);
                if (foundPostWithComments) {
                    const postWithComments = foundPostWithComments.allComments.filter(i => i.id === commentId)[0];
                    if (postWithComments.userId === userId && postWithComments.userLogin === userLogin) {
                        next();
                        return;
                    }
                    res.sendStatus(403);
                    return;
                }
                res.sendStatus(404);
                return;
            }
            catch (e) {
                console.log(e);
                res.sendStatus(401);
                return;
            }
        });
    }
}
exports.Auth = Auth;
//# sourceMappingURL=auth.js.map