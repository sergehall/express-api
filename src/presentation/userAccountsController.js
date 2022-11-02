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
exports.UsersAccountController = void 0;
const IoCContainer_1 = require("../IoCContainer");
const request_ip_1 = __importDefault(require("request-ip"));
class UsersAccountController {
    constructor(usersAccountService) {
        this.usersAccountService = usersAccountService;
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parseQueryData = yield IoCContainer_1.ioc.parseQuery.parse(req);
                const pageNumber = parseQueryData.pageNumber;
                const pageSize = parseQueryData.pageSize;
                const searchLoginTerm = parseQueryData.searchLoginTerm;
                const searchEmailTerm = parseQueryData.searchEmailTerm;
                const sortBy = parseQueryData.sortBy;
                const sortDirection = parseQueryData.sortDirection;
                const getUsers = yield this.usersAccountService.findUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection);
                if (!getUsers) {
                    res.status(404).send();
                }
                else {
                    res.send(getUsers);
                }
            }
            catch (e) {
                console.log(e);
                return res.sendStatus(500);
            }
        });
    }
    createNewUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientIp = request_ip_1.default.getClientIp(req);
                const userAccount = yield IoCContainer_1.ioc.usersAccountService.createUser(req.body.login, req.body.email, req.body.password, clientIp);
                if (userAccount) {
                    const userReturn = {
                        id: userAccount.accountData.id,
                        login: userAccount.accountData.login,
                        email: userAccount.accountData.email,
                        createdAt: userAccount.accountData.createdAt
                    };
                    res.status(201).send(userReturn);
                    return;
                }
                res.status(400).send({
                    errorsMessages: [
                        {
                            message: "E11000 duplicate key error collection",
                            field: "Login or password"
                        }
                    ]
                });
            }
            catch (e) {
                console.log(e.toString());
                return res.sendStatus(400);
            }
        });
    }
    deleteUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.userId;
                const deletedPost = yield IoCContainer_1.ioc.usersService.deleteUserById(id);
                if (deletedPost) {
                    res.sendStatus(204);
                }
                else {
                    res.sendStatus(404);
                }
            }
            catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        });
    }
}
exports.UsersAccountController = UsersAccountController;
//# sourceMappingURL=userAccountsController.js.map