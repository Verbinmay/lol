import { ObjectId } from "mongodb";
import { setting } from "../settings";
import jwt from "jsonwebtoken";
import { UserDBModel } from "../types";
export const jwtService = {
  async createJWT(user:any) {
    const token = jwt.sign({ userId: user._id }, setting.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  }
  ,
  async getUserIdByToken(token:string) {
    try {
      const result:any = jwt.verify(token, setting.JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  },
};
