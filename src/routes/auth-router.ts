import { Request, Response, Router } from "express";
import { jwtService } from "../application/jwt-service";
import { usersServer } from "../domain/user-service";
import {
  inputValidationMiddleware,
  loginOrEmailValidation,
  passwordValidation,
} from "../middleware/input-validation-middleware";

export const authRouter = Router({});

authRouter.post(
  "/login",
  loginOrEmailValidation,
  passwordValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const authUser = await usersServer.checkAuth(
      req.body.loginOrEmail,
      req.body.password
    );
    if (authUser) {
      
      const token = await jwtService.createJWT(authUser)
      res.status(201).send(token)
    } else {
      res.send(401);
    }
  }
);
