import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwt-service";
import { usersServer } from "../domain/user-service";

export const authMiddleware = async ( req: Request, res: Response, next : NextFunction)=> { 
    if ( !req.headers.authorization){
        res.send(401)
        return
    }
    const token = req.headers.authorization?.split(" ")[1]

    const userId = await jwtService.getUserIdByToken(token!)
    if(userId){
        req.user = await usersServer.findUserById(userId)
        next()
        return 
    }
    res.send(401)
}