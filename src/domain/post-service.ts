import { blogsRepository } from "../repositories/blog-repository";
import { postsCollections } from "../repositories/db";
import { postsRepository } from "../repositories/post-repository";


export const postsService = {
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    let isId: string = "";

    let findArray = await postsCollections.find({}).toArray();
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

  
    let isPostName = "";
    let a = await blogsRepository.findBlogById(blogId);
    if (a) {
      isPostName = a.name;
    }

    let isCreateAt: string = "";
    const today = new Date();
    isCreateAt = today.toISOString();

    const createdPost = {
      id: isId,
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: isPostName,
      createdAt: isCreateAt,
    };
    const result = await postsRepository.createPost(createdPost);
    return result;
  },
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    return await postsRepository.updatePost(
      id,
      title,
      shortDescription,
      content,
      blogId
    );
  },
  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(id);
  },
};
