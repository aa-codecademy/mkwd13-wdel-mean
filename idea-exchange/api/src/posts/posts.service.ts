import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './models/post.model';
import { Model } from 'mongoose';

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
}
