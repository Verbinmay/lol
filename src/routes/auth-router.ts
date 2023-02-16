import { Request, Response, Router } from "express";
import { jwtService } from "../application/jwt-service";
import { usersServer } from "../domain/user-service";
import { authMiddleware } from "../middleware/auth-middleware";
import {
  inputValidationMiddleware,
  loginOrEmailValidation,
  passwordValidation,
} from "../middleware/input-validation-middleware";
import { UserViewModel } from "../types";

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
      const token = await jwtService.createJWT(authUser);
      res.status(201).send(token);
    } else {
      res.send(401);
    }
  }
);

authRouter.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const myAuth = await usersServer.findUserById(req.user._id);
  const viewMyAuth = {
    email: myAuth!.email,
    login:myAuth!.login,
    userId: myAuth!.id }
  
res.send(viewMyAuth)
  
  
});
