import { Request, Response, Router } from "express";
import { usersServer } from "../domain/user-service";
import { avtorizationValidationMiddleware } from "../middleware/avtorization-middleware";
import {
  emailCreateValidation,
  inputValidationMiddleware,
  loginCreateValidation,
  loginOrEmailValidation,
  passwordCreateValidation,
} from "../middleware/input-validation-middleware";
import { usersRepository } from "../repositories/user-reposytory";
import { PaginatorUser } from "../types";

export const usersRouter = Router({});

usersRouter.get(
  "/",
  avtorizationValidationMiddleware,
  async (req: Request, res: Response) => {
    const foundUsers = await usersRepository.findUsers(
      req.query.sortBy?.toString(),
      req.query.sortDirection?.toString(),
      req.query.pageNumber?.toString(),
      req.query.pageSize?.toString(),
      req.query.searchLoginTerm?.toString(),
      req.query.searchEmailTerm?.toString()
    );
    const viewFoundUsers: PaginatorUser = {
      pagesCount: foundUsers.pagesCount,
      page: foundUsers.page,
      pageSize: foundUsers.pageSize,
      totalCount: foundUsers.totalCount,
      items: foundUsers.items.map((m) => {
        return {
          id: m.id,
          login: m.login,
          email: m.email,
          createdAt: m.createdAt,
        };
      }),
    };
    res.status(200).send(viewFoundUsers);
  }
);

usersRouter.post(
  "/",
  avtorizationValidationMiddleware,
  loginCreateValidation,
  passwordCreateValidation,
  emailCreateValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newUserCreated = await usersServer.createUser(
      req.body.login,
      req.body.password,
      req.body.email
    );
    const viewNewUser = {
      id: newUserCreated.id,
      login: newUserCreated.login,
      email: newUserCreated.email,
      createdAt: newUserCreated.createdAt,
    };
    res.status(201).send(viewNewUser);
  }
);

usersRouter.delete(
  "/:id",
  avtorizationValidationMiddleware,
  async (req: Request, res: Response) => {
    const deletedUserById = await usersServer.deleteUser(req.params.id);
    if (deletedUserById) {
      res.send(204);
    } else {
      res.send(404);
    }
  }
);
