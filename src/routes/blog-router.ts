import { Request, Response, Router } from "express";
import { blogsService } from "../domain/blog-service";
import { postsService } from "../domain/post-service";
import { avtorizationValidationMiddleware } from "../middleware/avtorization-middleware";
import { websiteUrlValidation, nameValidation, descriptionValidation, inputValidationMiddleware, isBlogIdValidationInPath, shortDescriptionValidation, titleValidation, contentValidation } from "../middleware/input-validation-middleware";
import { blogsRepository } from "../repositories/blog-repository";
import { PaginatorBlog, BlogViewModel, PaginatorPost, PostViewModel } from "../types";

export const blogsRouter = Router({});

blogsRouter.get("/", async (req: Request, res: Response) => {
  const foundBlogsInBd = await blogsRepository.findBlogs(
    req.query.searchNameTerm?.toString(),
    req.query.sortBy?.toString(),
    req.query.pageNumber?.toString(),
    req.query.pageSize?.toString(),
    req.query.sortDirection?.toString()
  );
  const foundBlogs: PaginatorBlog = {
    pagesCount: foundBlogsInBd.pagesCount,
    page: foundBlogsInBd.page,
    pageSize: foundBlogsInBd.pageSize,
    totalCount: foundBlogsInBd.totalCount,
    items: foundBlogsInBd.items.map((m:any) => {
      return {
        id: m.id,
        name: m.name,
        description: m.description,
        websiteUrl: m.websiteUrl,
        createdAt: m.createdAt,
        isMembership: m.isMembership,
      };
    }),
  };
  res.send(foundBlogs);
});
blogsRouter.get("/:id", async (req: Request, res: Response) => {
  const foundBlogInBd = await blogsRepository.findBlogById(req.params.id);
  if (foundBlogInBd) {
    const foundBlog: BlogViewModel = {
      id: foundBlogInBd.id,
      name: foundBlogInBd.name,
      description: foundBlogInBd.description,
      websiteUrl: foundBlogInBd.websiteUrl,
      createdAt: foundBlogInBd.createdAt,
      isMembership: foundBlogInBd.isMembership,
    };
    res.send(foundBlog);
  } else {
    res.send(404);
  }
});
blogsRouter.post(
  "/",
  avtorizationValidationMiddleware,
  websiteUrlValidation,
  nameValidation,
  descriptionValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newBlogInBd = await blogsService.createBlog(
      req.body.name,
      req.body.description,
      req.body.websiteUrl
    );
    const newBlog: BlogViewModel = {
      id: newBlogInBd!.id,
      name: newBlogInBd!.name,
      description: newBlogInBd!.description,
      websiteUrl: newBlogInBd!.websiteUrl,
      createdAt: newBlogInBd!.createdAt,
      isMembership: newBlogInBd!.isMembership,
    };
    res.status(201).send(newBlog);
  }
);
blogsRouter.put(
  "/:id",
  avtorizationValidationMiddleware,
  websiteUrlValidation,
  nameValidation,
  descriptionValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const updateBlogInBd = await blogsService.updateBlog(
      req.params.id,
      req.body.name,
      req.body.description,
      req.body.websiteUrl
    );
    if (updateBlogInBd) {
      res.send(204);
    } else {
      res.send(404);
    }
  }
);
blogsRouter.delete(
  "/:id",
  avtorizationValidationMiddleware,
  async (req: Request, res: Response) => {
    const DeleteBlogInBd = await blogsService.deleteBlog(req.params.id);
    if (DeleteBlogInBd) {
      res.send(204);
    } else {
      res.send(404);
    }
  }
);

blogsRouter.get("/:id/posts",
isBlogIdValidationInPath,
async (req: Request, res: Response) => {
    const foundPostsByBlogerIdInBd = await blogsRepository.findPostsByBlogerId(
      req.params.id,
      req.query.sortBy?.toString(),
      req.query.pageNumber?.toString(),
      req.query.pageSize?.toString(),
      req.query.sortDirection?.toString()
    );
    const foundBlogs: PaginatorPost = {
      pagesCount: foundPostsByBlogerIdInBd.pagesCount,
      page: foundPostsByBlogerIdInBd.page,
      pageSize: foundPostsByBlogerIdInBd.pageSize,
      totalCount: foundPostsByBlogerIdInBd.totalCount,
      items: foundPostsByBlogerIdInBd.items.map((m) => {
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
    res.status(200).send(foundBlogs);
});
blogsRouter.post(
  "/:id/posts",
  avtorizationValidationMiddleware,
  isBlogIdValidationInPath,
  shortDescriptionValidation,
  titleValidation,
  contentValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newPostByIdInBd = await postsService.createPost(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.params.id
    );
    const newPost: PostViewModel = {
      id: newPostByIdInBd!.id,
      title: newPostByIdInBd!.title,
      shortDescription: newPostByIdInBd!.shortDescription,
      content: newPostByIdInBd!.content,
      blogId: newPostByIdInBd!.blogId,
      blogName: newPostByIdInBd!.blogName,
      createdAt: newPostByIdInBd!.createdAt,
    };
    res.status(201).send(newPost);
  }
);
