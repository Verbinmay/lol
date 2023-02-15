import { BlogViewModel, PaginatorPost } from "../types";
import { blogsCollections, postsCollections } from "./db";

export const blogsRepository = {
    async findBlogs(
      name: string | undefined | null,
      sortBy: string | undefined | null,
      pageNumber: string | undefined | null,
      pageSize: string | undefined | null,
      sortDirection: string | undefined | null
    ) {
      const filter: any = {};
      if (name) {
        filter.name = { $regex: "(?i)" + name + "(?-i)" };
      }
      let ItSortBy = "createdAt";
      if (sortBy != (undefined || null)) {
        ItSortBy = sortBy;
      }
      let ItSortDirection = "desc";
      if (sortDirection != (undefined || null)) {
        ItSortDirection = sortDirection;
      }
      let pomogator = (-1);
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
  
      const IttotalCount = await blogsCollections.countDocuments(filter);
  
      const ItpagesCount = Math.ceil(IttotalCount / ItPageSize);
      const arrayOfFoundBlogs = await blogsCollections
        .find(filter, { projection: { _id: 0 } })
        .sort(filterSort)
        .skip((ItPageNumber - 1) * ItPageSize)
        .limit(ItPageSize)
        .toArray();
  
  
      const newPaginatorBlog = {
        pagesCount: ItpagesCount,
        page: ItPageNumber,
        pageSize: ItPageSize,
        totalCount: IttotalCount,
        items: arrayOfFoundBlogs,
      };
      return newPaginatorBlog;
    },
    async findBlogById(id: string) {
      const foundBlogById: BlogViewModel | null = await blogsCollections.findOne(
        { id: id },
        { projection: { _id: 0 } }
      );
      return foundBlogById;
    },
    async createBlog(createdBlog: BlogViewModel) {
      const result = await blogsCollections.insertOne(createdBlog);
      return blogsRepository.findBlogById(createdBlog.id);
    },
    async updateBlog(
      id: string,
      name: string,
      description: string,
      websiteUrl: string
    ): Promise<boolean> {
      const result = await blogsCollections.updateOne(
        { id: id },
        { $set: { name: name, description: description, websiteUrl: websiteUrl } }
      );
      return result.matchedCount === 1;
    },
    async deleteBlog(id: string): Promise<boolean> {
      const result = await blogsCollections.deleteOne({ id: id });
      return result.deletedCount === 1;
    },
    async findPostsByBlogerId(
      id: string,
      sortBy: string | undefined | null,
      pageNumber: string | undefined | null,
      pageSize: string | undefined | null,
      sortDirection: string | undefined | null
    ) {
      let ItSortBy = "createdAt";
      if (sortBy != (undefined || null)) {
        ItSortBy = sortBy;
      }
  
      let ItSortDirection = "desc";
      if (sortDirection != (undefined || null)) {
        ItSortDirection = sortDirection;
      }
  
      let pomogator = (-1);
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
  
      const IttotalCount = await postsCollections.countDocuments({ blogId: id });
  
      const ItpagesCount = Math.ceil(IttotalCount / ItPageSize);
      const arrayOfFoundPosts = await postsCollections
        .find({ blogId: id }, { projection: { _id: 0 } })
        .sort(filterSort)
        .skip((ItPageNumber - 1) * ItPageSize)
        .limit(ItPageSize)
        .toArray();
        const n = [...arrayOfFoundPosts]
      const newPaginatorPosts: PaginatorPost = {
        pagesCount: ItpagesCount,
        page: ItPageNumber,
        pageSize: ItPageSize,
        totalCount: IttotalCount,
        items: n,
      };
      return newPaginatorPosts;
    },
  };
  