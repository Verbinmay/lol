import { Request, Response, Router } from "express";
import { postsService } from "../domain/post-service";
import { avtorizationValidationMiddleware } from "../middleware/avtorization-middleware";
import { shortDescriptionValidation, titleValidation, contentValidation, isBlogIdValidation, inputValidationMiddleware } from "../middleware/input-validation-middleware";
import { postsRepository } from "../repositories/post-repository";
import { PaginatorPost, PostViewModel } from "../types";


export const postsRouter = Router({});

postsRouter.get("/", async (req: Request, res: Response) => {
  const foundPostsInBd = await postsRepository.findPosts(
    req.query.sortBy?.toString(),
    req.query.pageNumber?.toString(),
    req.query.pageSize?.toString(),
    req.query.sortDirection?.toString()
  );
  const foundPosts: PaginatorPost = {
    pagesCount: foundPostsInBd.pagesCount,
    page: foundPostsInBd.page,
    pageSize: foundPostsInBd.pageSize,
    totalCount: foundPostsInBd.totalCount,
    items: foundPostsInBd.items.map((m) => {
      return {
        id: m.id,
        title: m.title,
        shortDescription: m.shortDescription,
        content: m.content,
        blogId: m.blogId,
        blogName: m.blogName,
        createdAt: m.createdAt,
      };
    }),
  };
  res.send(foundPosts);
});

postsRouter.get("/:id", async (req: Request, res: Response) => {
  const foundPostInBd = await postsRepository.findPostById(req.params.id);
  if (foundPostInBd) {
    const foundPost: PostViewModel = {
      id: foundPostInBd.id,
      title: foundPostInBd.title,
      shortDescription: foundPostInBd.shortDescription,
      content: foundPostInBd.content,
      blogId: foundPostInBd.blogId,
      blogName: foundPostInBd.blogName,
      createdAt: foundPostInBd.createdAt,
    };
    res.send(foundPost);
  } else {
    res.send(404);
  }
});

postsRouter.post("/",
avtorizationValidationMiddleware,
    shortDescriptionValidation,
    titleValidation,
    contentValidation,
    isBlogIdValidation,
    inputValidationMiddleware,
async (req: Request, res: Response) => {
  const newPostInBd = await postsService.createPost(
    req.body.title,
    req.body.shortDescription,
    req.body.content,
    req.body.blogId
  );
  const newPost: PostViewModel = {
    id: newPostInBd!.id,
    title: newPostInBd!.title,
    shortDescription: newPostInBd!.shortDescription,
    content: newPostInBd!.content,
    blogId: newPostInBd!.blogId,
    blogName: newPostInBd!.blogName,
    createdAt: newPostInBd!.createdAt,
  };
  res.status(201).send(newPost);
});

postsRouter.put("/:id", 
avtorizationValidationMiddleware,
shortDescriptionValidation,
titleValidation,
contentValidation,
isBlogIdValidation,
inputValidationMiddleware,
async (req: Request, res: Response) => {
  const updatePostInBd = await postsService.updatePost(
    req.params.id,
    req.body.title,
    req.body.shortDescription,
    req.body.content,
    req.body.blogId
  );
  if (updatePostInBd) {
    res.send(204);
  } else {
    res.send(404);
  }
});

postsRouter.delete("/:id",
avtorizationValidationMiddleware,
async (req: Request, res: Response) => {
  const deletePostInBd = await postsService.deletePost(req.params.id);
  if (deletePostInBd) {
    res.send(204);
  } else {
    res.send(404);
  }
});
