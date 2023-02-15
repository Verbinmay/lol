import { blogsRepository } from "../repositories/blog-repository";
import { blogsCollections } from "../repositories/db";

export const blogsService = {
  async createBlog(name: string, description: string, websiteUrl: string) {
    let isId: string = "";
    let findArray = await blogsCollections.find({}).toArray();
    let mappedArray = [...findArray].map((n) => {
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

    let isIsMembership: boolean = false;
    const createdBlog = {
      id: isId,
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: isCreateAt,
      isMembership: isIsMembership,
    };
    const result = await blogsRepository.createBlog(createdBlog);
    return result;
  },
  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    return await blogsRepository.updateBlog(id, name, description, websiteUrl);
  },

  async deleteBlog(id: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(id);
  },
};
