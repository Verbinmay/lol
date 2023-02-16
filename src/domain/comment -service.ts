import { commentsRepository } from "../repositories/comment-repository"
import { commentsCollections } from "../repositories/db"

export const commentsService = {
   async updateCommentById(id:string, content:string){
    const result = await commentsRepository.updateCommentById(id, content)
    return result 
   },
   async deleteComment(id:string) {
    const result = await commentsRepository.deleteCommentById(id)
    return result
   },
   async createComment(postId:string, content:string, user:any) {

      let isId: string = "";

      let findArray = await commentsCollections.find({}).toArray();
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

    const newComment = {
      id: isId,
      content: content,
      commentatorInfo: {
         userId:user.id,
         userLogin:user.login
      },
      createdAt:isCreateAt,
      postId:postId}

      const result = await commentsRepository.createComment(newComment);
      return result 

    
   }
}