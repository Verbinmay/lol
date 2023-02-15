import { PostViewModel } from "../types";
import { postsCollections } from "./db";

export const postsRepository = {
  async findPosts(
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

    const IttotalCount = await postsCollections.countDocuments({});

    const ItpagesCount = Math.ceil(IttotalCount / ItPageSize);
    const arrayOfFoundPosts = await postsCollections
      .find({}, { projection: { _id: 0 } })
      .sort(filterSort)
      .skip((ItPageNumber-1) * ItPageSize)
      .limit(ItPageSize)
      .toArray()
      ;
      const n = [...arrayOfFoundPosts]

    const newPaginatorBlog = {
      pagesCount: ItpagesCount,
      page: ItPageNumber,
      pageSize: ItPageSize,
      totalCount: IttotalCount,
      items: n,
    };
    return newPaginatorBlog;
  },
  async findPostById(id: string) {
    const foundpostById: PostViewModel | null = await postsCollections.findOne(
      { id: id },
      { projection: { _id: 0 } }
    );
    return foundpostById;
  },
  async createPost(createdPost: PostViewModel) {
    const result = await postsCollections.insertOne(createdPost);
    return await postsRepository.findPostById(createdPost.id);
  },
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    const result = await postsCollections.updateOne(
      { id: id },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
        },
      }
    );
    return result.matchedCount === 1;
  },
  async deletePost(id: string): Promise<boolean> {
    const result = await postsCollections.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
};
