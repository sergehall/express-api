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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsController = void 0;
class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
        this.commentsService = commentsService;
    }
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commId = req.params.commentId;
                const currentUser = req.user;
                const getComment = yield this.commentsService.getCommentById(commId, currentUser);
                if (getComment.data !== null) {
                    res.send(getComment.data);
                }
                else {
                    res.status(404).send();
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        });
    }
    updateCommentsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = req.params.commentId;
                const content = req.body.content;
                const updatedComment = yield this.commentsService.updateCommentById(commentId, content);
                if (updatedComment.resultCode === 0) {
                    res.status(204);
                    res.send();
                    return;
                }
                const errorsMessages = updatedComment.errorsMessages;
                const resultCode = updatedComment.resultCode;
                res.send({ errorsMessages, resultCode });
            }
            catch (error) {
                console.log(error);
                return res.sendStatus(500);
            }
        });
    }
    likeStatusCommentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const likeStatus = req.body.likeStatus;
            const commentId = req.params.commentId;
            const user = req.user;
            const likeStatusComment = yield this.commentsService.changeLikeStatusComment(user, commentId, likeStatus);
            if (!likeStatusComment) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    deleteCommentsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentsId = req.params.commentId;
            const deletedComments = yield this.commentsService.deletedCommentById(commentsId);
            if (deletedComments.errorsMessages.length === 0) {
                res.sendStatus(204);
                return;
            }
            res.send();
            return;
        });
    }
}
exports.CommentsController = CommentsController;
//# sourceMappingURL=commentsController.js.map