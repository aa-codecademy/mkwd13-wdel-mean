import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from 'src/posts/models/post.model';
import { User } from 'src/users/models/user.model';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  timestamps: true,
})
export class Comment {
  @Prop()
  name: string;

  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 140,
  })
  body: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  author: mongoose.Schema.Types.ObjectId | User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  })
  post: Post;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
