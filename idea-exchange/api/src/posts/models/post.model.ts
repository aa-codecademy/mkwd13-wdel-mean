import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/models/user.model';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: true,
})
export class Post {
  @Prop()
  name: string;

  @Prop({
    required: true,
    minLength: 3,
    maxlength: 40,
  })
  title: string;

  @Prop({
    required: true,
    minLength: 3,
    maxlength: 240,
  })
  body: string;

  @Prop({
    type: [String],
    required: true,
    default: [],
  })
  likes: string[];

  @Prop({
    type: [String],
    required: true,
    default: [],
  })
  dislikes: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  author: User | mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  })
  comments: Comment[] | mongoose.Schema.Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
