import { commentsCollections } from "./db";

export const commentsRepository = {
  async findCommentById(id: string) {
    const result = await commentsCollections.findOne({ id: id });
    return result;
  },
  async updateCommentById(id: string, content: string) {
    const result = await commentsCollections.updateOne(
      { id: id },
      { $set: { content: content }}
    );
    return result.matchedCount === 1;
  },
  async deleteCommentById(id: string) {
    const result = await commentsCollections.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
  async findCommentsByPostId(
    postId: string|undefined|null,
    pageNumber: string|undefined|null,
    pageSize: string|undefined|null,
    sortBy: string|undefined|null,
    sortDirection: string|undefined|null
  ) {
    const filter = {postId:postId};
    

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

    const IttotalCount = await commentsCollections.countDocuments(filter);

    const ItpagesCount = Math.ceil(IttotalCount / ItPageSize);

    const result = await commentsCollections.find(filter)
    .sort(filterSort)
    .skip((ItPageNumber - 1) * ItPageSize)
    .limit(ItPageSize)
    .toArray();

    const newPaginatorComments = {
        pagesCount: ItpagesCount,
        page: ItPageNumber,
        pageSize: ItPageSize,
        totalCount: IttotalCount,
        items: result,
      };
      return newPaginatorComments;
  },
  async createComment (newComment:any){
    commentsCollections.insertOne(newComment)
    return await commentsRepository.findCommentById(newComment.id)
  }
};
