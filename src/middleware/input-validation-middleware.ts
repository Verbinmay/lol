import { NextFunction, Request, Response } from "express";
import { validationResult, body } from "express-validator";
import { blogsRepository } from "../repositories/blog-repository";
import { blogsCollections } from "../repositories/db";

export const nameValidation = body("name")
  .isString()
  .withMessage("Not name")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Name is empty")
  .bail()
  .isLength({ max: 15 })
  .withMessage("Names length must be max 15");
export const descriptionValidation = body("description")
  .isString()
  .withMessage("Isnt string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Description is empty")
  .bail()
  .isLength({ max: 500 })
  .withMessage("Description length must be max 500");
export const websiteUrlValidation = body("websiteUrl")
  .isURL()
  .withMessage("Isnt URL")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("WebsiteURL is empty")
  .bail()
  .isLength({ max: 100 })
  .withMessage("WebsiteUrl ength must be max 100");

export const titleValidation = body("title")
  .isString()
  .withMessage("Title isnt string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Title is empty")
  .bail()
  .isLength({ max: 30 })
  .withMessage("Title length must be max 30");
export const shortDescriptionValidation = body("shortDescription")
  .isString()
  .withMessage("ShortDescription isnt string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("ShortDescription is empty")
  .bail()
  .isLength({ max: 100 })
  .withMessage("shortDescription length must be max 100");
export const contentValidation = body("content")
  .isString()
  .withMessage("content isnt string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("content is empty")
  .bail()
  .isLength({ max: 1000 })
  .withMessage("content length must be max 1000");
export const isBlogIdValidation = body("blogId").custom(async (value) => {
  let result = await blogsCollections.findOne({ id: value });
  if (result) {
  }
  if (result == null) {
    throw new Error("Please insert existed user id");
  }
  return true;
});
export async function isBlogIdValidationInPath(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let result = await blogsRepository.findBlogById(req.params.id);
  if (result === null) {
    return res.send(404);
  } else {
    return next();
  }
}

export const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .withMessage("loginOrEmail isnt string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("loginOrEmail is empty");

  export const passwordValidation = body("password")
  .isString()
  .withMessage("password isnt string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("password is empty");

  
  export const loginCreateValidation = body("login")
  .isString()
  .withMessage("Isnt string")
  .bail()
  .isLength({ min:3, max: 10 })
  .withMessage("login length must be min 3, max 10");
  
  export const passwordCreateValidation = body("password")
  .isString()
  .withMessage("Isnt string")
  .bail()
  .isLength({ min:6, max: 20 })
  .withMessage("login length must be min 6, max 20");

  export const emailCreateValidation = body("email")
  .isEmail()
  .withMessage("Isnt email")
  .bail()
  


export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let newErorsArray = errors.array().map(function (a) {
      return {
        message: a.msg,
        field: a.param,
      };
    });
    res.status(400).json({ errorsMessages: newErorsArray });
  } else {
    next();
  }
};
