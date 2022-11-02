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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_connection_1 = require("./repositories/db-connection");
const auth_router_1 = require("./routes/auth-router");
const bloggers_router_1 = require("./routes/bloggers-router");
const posts_router_1 = require("./routes/posts-router");
const feedbacks_router_1 = require("./routes/feedbacks-router");
const all_deleted_bloggers_router_1 = require("./routes/all-deleted-bloggers-router");
const comments_router_1 = require("./routes/comments-router");
const email_router_1 = require("./routes/email-router");
const testing_router_1 = require("./routes/testing-router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_router_1 = require("./routes/users-router");
const blogs_router_1 = require("./routes/blogs-router");
const securityDevices_router_1 = require("./routes/securityDevices-router");
const IoCContainer_1 = require("./IoCContainer");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
const port = process.env.PORT || 5000;
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
});
app.use('/auth', auth_router_1.authRouter);
app.use('/security', securityDevices_router_1.securityDevicesRouter);
app.use('/posts', posts_router_1.postsRouts);
app.use('/blogs', blogs_router_1.blogsRouts);
app.use('/bloggers', bloggers_router_1.bloggersRouts);
app.use('/users', users_router_1.usersRouter);
app.use('/feedbacks', feedbacks_router_1.feedbacksRouter);
app.use('/comments', comments_router_1.commentsRouter);
app.use('/email', email_router_1.emailRouter);
app.use('/testing/', testing_router_1.testingRouter);
app.use('/deleted-bloggers', all_deleted_bloggers_router_1.allDeletedBloggersRouts);
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_connection_1.runDb)();
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`);
    });
});
startApp()
    .then(() => [IoCContainer_1.ioc.emailSender.sendAndDeleteConfirmationCode(),
    IoCContainer_1.ioc.emailSender.sendAndDeleteRecoveryCode(),
    IoCContainer_1.ioc.clearingIpWithDateOlder11Sec.start(),
    IoCContainer_1.ioc.clearingExpDateJWT.start()
]);
//# sourceMappingURL=index.js.map