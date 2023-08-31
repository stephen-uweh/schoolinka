import { CommentEntity } from "./comment.entity";
import { PostEntity } from "./post.entity";
import { UserEntity } from "./user.entity";


export class ColumnNumericTransformer {
    to(data: number): number {
      return data;
    }
    from(data: string): number {
      return parseFloat(data);
    }
  }

export const entities = [
    UserEntity,
    PostEntity,
    CommentEntity
]