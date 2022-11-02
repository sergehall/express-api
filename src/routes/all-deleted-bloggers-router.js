"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allDeletedBloggersRouts = void 0;
const express_1 = require("express");
const IoCContainer_1 = require("../IoCContainer");
exports.allDeletedBloggersRouts = (0, express_1.Router)({});
exports.allDeletedBloggersRouts.get('/', IoCContainer_1.ioc.allDelBloggersController.getAllDeletedBloggers.bind(IoCContainer_1.ioc.allDelBloggersController));
//# sourceMappingURL=all-deleted-bloggers-router.js.map