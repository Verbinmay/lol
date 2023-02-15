import { usersCollections } from "../repositories/db";
import { usersRepository } from "../repositories/user-reposytory";
import bcrypt from "bcrypt";
import { UserDBModel } from "../types";

export const usersServer = {
  async checkAuth(loginOrEmail: string, password: string) {
    const user = await usersRepository.findloginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return user;
    } else {
      return null;
    }
  },

  async createUser(login: string, password: string, email: string) {
    let isId: string = "";
    let findArray = await usersCollections.find({}).toArray();
    let mappedArray = findArray.map((n) => {
      return n.id;
    });
    let schetchik = false;
    let i = 0;
    do {
      i++;
      schetchik = mappedArray.includes(String(i));
    } while (schetchik === true);
    isId = String(i);

    let isCreateAt: string = "";
    const today = new Date();
    isCreateAt = today.toISOString();

    const hash = await bcrypt.hash(password, 10);
    const makeUser = {
      id: isId,
      login: login,
      email: email,
      createdAt: isCreateAt,
      password: hash,
    };
    const addNewUser = usersRepository.createUser(makeUser);
    return addNewUser;
  },
  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id);
  },
  async findUserById(id:any){
    const result = await usersRepository.findUserById(id)
    return result
    
  }
};
