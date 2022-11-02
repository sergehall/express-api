"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundBlogId = exports.notDeletedComment = exports.notFoundCommentId = exports.notFoundPostId = exports.notFoundBloggerId = exports.MongoHasNotUpdated = void 0;
// db
exports.MongoHasNotUpdated = {
    message: "Mongo database has not updated the data",
    field: "MongoDb"
};
exports.notFoundBloggerId = {
    message: "Invalid 'bloggerId' such blogger doesn't exist",
    field: "bloggerId"
};
exports.notFoundPostId = {
    message: "Invalid '/:postId' such post doesn't exist",
    field: "postId"
};
// comments
exports.notFoundCommentId = {
    message: "Invalid 'commentId' such comment doesn't exist",
    field: "commentId"
};
exports.notDeletedComment = {
    message: "comment not deleted",
    field: "notDeleted"
};
// Blog
exports.notFoundBlogId = {
    message: "Invalid '/:blogId' such blog doesn't exist",
    field: "blogId"
};
//# sourceMappingURL=errorsMessages.js.map