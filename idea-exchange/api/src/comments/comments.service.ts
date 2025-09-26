import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './models/comment.model';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private postsService: PostsService,
  ) {}

  async create(userId: string, createCommentDto: CreateCommentDto) {
    try {
      const foundPost = await this.postsService.findOne(
        createCommentDto.postId,
      );

      const newComment = new this.commentModel({
        author: userId,
        post: foundPost.id,
        body: createCommentDto.body,
      });

      const createdComment = await newComment.save();

      foundPost.comments.push(createdComment.id);

      await foundPost.save();

      return createdComment;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Couldn't create comment, ERROR: ${error}`);
    }
  }

  findByUser(userId: string) {
    return this.commentModel.find({ author: userId }).sort('-createdAt');
  }
}
