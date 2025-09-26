import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './models/post.model';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const newPost = new this.postModel({ ...createPostDto, author: userId });

    const createdPost = await newPost.save();

    return createdPost;
  }

  findAll() {
    return this.postModel
      .find({})
      .populate({
        path: 'author',
        select: 'username',
      })
      .sort('-createdAt');
  }

  async findOne(id: string) {
    try {
      const foundPost = await this.postModel
        .findById(id)
        .populate({
          path: 'author',
          select: 'username',
        })
        .populate({
          path: 'comments',
          populate: {
            path: 'author',
            select: 'username',
          },
          options: { sort: { createdAt: 'desc' } },
        });

      if (!foundPost) throw new Error('');

      return foundPost;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Post Not Found');
    }
  }

  async update(userId: string, id: string, updatePostDto: UpdatePostDto) {
    try {
      const foundPost = await this.postModel.findOne({
        _id: id,
        author: userId,
      });

      if (!foundPost) throw 'Post Not Found';

      Object.assign(foundPost, updatePostDto);

      await foundPost.save();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Coudln't update post, ERROR: ${error}`);
    }
  }

  async remove(userId: string, id: string) {
    try {
      const response = await this.postModel.findOneAndDelete({
        _id: id,
        author: userId,
      });

      if (!response) throw 'Post Not Found';
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Coudln't delete post, ERROR: ${error}`);
    }
  }

  async findByUser(userId: string) {
    return this.postModel.find({ author: userId }).sort('-createdAt');
  }

  async likePost(userId: string, postId: string) {
    try {
      const post = await this.postModel.findById(postId).populate({
        path: 'author',
        select: 'username',
      });

      if (!post) throw 'Post not found';

      const authorId = post?.author['_id'] as mongoose.Schema.Types.ObjectId;

      if (userId === authorId.toString()) throw 'Operation not allowed';

      const dislikeExists = post.dislikes.some((id) => id === userId);
      const likeExits = post.likes.some((id) => id === userId);

      if (dislikeExists) {
        post.dislikes = post.dislikes.filter((id) => id !== userId);
        post.likes.push(userId);
      } else if (likeExits) {
        post.likes = post.likes.filter((id) => id !== userId);
      } else {
        post.likes.push(userId);
      }

      const updatedPost = await post.save();

      return updatedPost;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Coudln't like post, ERROR: ${error}`);
    }
  }

  async dislikePost(userId: string, postId: string) {
    try {
      const post = await this.postModel.findById(postId).populate({
        path: 'author',
        select: 'username',
      });

      if (!post) throw 'Post not found';

      const authorId = post?.author['_id'] as mongoose.Schema.Types.ObjectId;

      if (userId === authorId.toString()) throw 'Operation not allowed';

      const dislikeExists = post.dislikes.some((id) => id === userId);
      const likeExits = post.likes.some((id) => id === userId);

      if (likeExits) {
        post.likes = post.likes.filter((id) => id !== userId);
        post.dislikes.push(userId);
      } else if (dislikeExists) {
        post.dislikes = post.dislikes.filter((id) => id !== userId);
      } else {
        post.dislikes.push(userId);
      }

      const updatedPost = await post.save();

      return updatedPost;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Coudln't dislike post, ERROR: ${error}`);
    }
  }
}
