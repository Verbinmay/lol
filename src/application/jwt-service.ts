import { ObjectId } from "mongodb";
import { setting } from "../settings";
import jwt from "jsonwebtoken";

export const jwtService = {
  async createJWT(user:any) {
    const token = jwt.sign({ userId: user.id }, setting.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  }
  ,
  async getUserIdByToken(token:string) {
    try {
      const result:any = jwt.verify(token, setting.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
