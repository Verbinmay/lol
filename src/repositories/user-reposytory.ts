import { ObjectId } from "mongodb";
import { usersCollections } from "./db";

export const usersRepository = {
  async findUsers(
    sortBy: string | undefined | null,
    sortDirection: string | undefined | null,
    pageNumber: string | undefined | null,
    pageSize: string | undefined | null,
    searchLoginTerm: string | undefined | null,
    searchEmailTerm: string | undefined | null
  ) {
    let filter: any = {};
    if (searchLoginTerm && searchEmailTerm) {
      filter = {
        $or: [
          { login: { $regex: "(?i)" + searchLoginTerm + "(?-i)" } },
          { email: { $regex: "(?i)" + searchEmailTerm + "(?-i)" } },
        ],
      };
    } else if (searchLoginTerm) {
      filter.login = { $regex: "(?i)" + searchLoginTerm + "(?-i)" };
    } else if (searchEmailTerm) {
      filter.email = { $regex: "(?i)" + searchEmailTerm + "(?-i)" };
    }
    let ItSortBy = "createdAt";
    if (sortBy != (undefined || null)) {
      ItSortBy = sortBy;
    }
    let ItSortDirection = "desc";
    if (sortDirection != (undefined || null)) {
      ItSortDirection = sortDirection;
    }
    let pomogator = -1;
    if (ItSortDirection === "asc") {
      pomogator = 1;
    }
    const filterSort: any = {};
    filterSort[ItSortBy as keyof typeof filterSort] = pomogator;

    let ItPageNumber = 1;
    if (pageNumber != (undefined || null)) {
      ItPageNumber = Number(pageNumber);
    }

    let ItPageSize = 10;
    if (pageSize != (undefined || null)) {
      ItPageSize = Number(pageSize);
    }

    const IttotalCount = await usersCollections.countDocuments(filter);

    const ItpagesCount = Math.ceil(IttotalCount / ItPageSize);
    const arrayOfFoundUsers = await usersCollections
      .find(filter, { projection: { _id: 0 } })
      .sort(filterSort)
      .skip((ItPageNumber - 1) * ItPageSize)
      .limit(ItPageSize)
      .toArray();

    const newPaginatorUser = {
      pagesCount: ItpagesCount,
      page: ItPageNumber,
      pageSize: ItPageSize,
      totalCount: IttotalCount,
      items: arrayOfFoundUsers,
    };
    return newPaginatorUser;
  },
  async findloginOrEmail(loginOrEmail: string) {
    const searchUser = await usersCollections.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return searchUser;
  },
  async findUserById (id: any){
    const foundUser = await usersCollections.findOne({_id:id })
    return foundUser
  },

  async createUser(user: any) {
    const result = await usersCollections.insertOne(user);
    return user;
  },
  async deleteUser(id: string): Promise<boolean> {
    const result = await usersCollections.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

};
