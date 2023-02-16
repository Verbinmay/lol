import { Request, Response, Router } from "express";
import { commentsService } from "../domain/comment -service";
import { postsService } from "../domain/post-service";
import { authMiddleware } from "../middleware/auth-middleware";
import { commentsRepository } from "../repositories/comment-repository";
import { postsRepository } from "../repositories/post-repository";
import { CommentViewModel, PaginatorCommentViewModel } from "../types";
import { postsRouter } from "./post-router";

export const commentsRouter = Router({});

commentsRouter.get("/:id", async (req: Request, res: Response) => {
  const foundCommentById = await commentsRepository.findCommentById(
    req.params.id
  );
  if (foundCommentById) {
    const viewFoundCommentById = {
      id: foundCommentById.id,
      content: foundCommentById.content,
      commentatorInfo: {
        userId: foundCommentById.commentatorInfo.userId,
        userLogin: foundCommentById.commentatorInfo.userId,
      },
      createdAt: foundCommentById.createdAt,
    };
    res.send(viewFoundCommentById);
  } else {
    res.send(404);
  }
});

commentsRouter.put(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const isIdComment = await commentsRepository.findCommentById(req.params.id);
    if (!(isIdComment!.commentatorInfo.userId == req.user.id)) {
      res.send(403);
    }

    const updatedComment = await commentsService.updateCommentById(
      req.params.id,
      req.body.content
    );
    if (updatedComment) {
      res.send(204);
    } else {
      res.send(404);
    }
  }
);

commentsRouter.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const isIdComment = await commentsRepository.findCommentById(req.params.id);
    if (!(isIdComment!.commentatorInfo.userId == req.user.id)) {
      res.send(403);
    }

    const deletedComment = await commentsService.deleteComment(req.params.id);
    if (deletedComment) {
      res.send(204);
    } else {
      res.send(404);
    }
  }
);
postsRouter.get(
  "/:postId/comments",
  authMiddleware,
  async (req: Request, res: Response) => {
    const foundedPost = await postsRepository.findPostById(req.params.postId);
    if (!foundedPost) {
      res.send(404);
    }
    const foundCommentsByPostId = await commentsRepository.findCommentsByPostId(
      req.params.postId,
      req.query.pageNumber?.toString(),
      req.query.pageSize?.toString(),
      req.query.sortBy?.toString(),
      req.query.sortDirection?.toString()
    );
    if (foundCommentsByPostId) {
      const viewCommentsByPostId = {
        pagesCount: foundCommentsByPostId.pagesCount,
        page: foundCommentsByPostId.page,
        pageSize: foundCommentsByPostId.pageSize,
        totalCount: foundCommentsByPostId.totalCount,
        items: foundCommentsByPostId.items.map((m) => {
          return {
            id: m.id,
            content: m.content,
            commentatorInfo: {
              userId: m.commentatorInfo.userId,
              userLogin: m.commentatorInfo.userLogin,
            },
            createdAt: m.createdAt,
          };
        }),
      };
      res.status(200).send(viewCommentsByPostId);
    } else res.send(404);
  }
);
postsRouter.post("/id/comments", authMiddleware,async(req:Request, res: Response)=>{
    const foundedPost = await postsRepository.findPostById(req.params.postId);
    if (!foundedPost) {
      res.send(404);
    }
    const createdComment = await commentsService.createComment(req.params.postId, req.body.content,req.user)
    if(createdComment){
        const viewCreatedContent = {
            id: createdComment.id,
            content:createdComment.content ,
            commentatorInfo:{
                userId: req.user.id,
                userLogin: req.user.login,
            },
            createdAt: createdComment.createdAt
        }
        res.status(201).send(viewCreatedContent)
    } else {
        res.send(404)
    }
} )
