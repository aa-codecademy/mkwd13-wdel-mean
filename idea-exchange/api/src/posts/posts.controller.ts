import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postsService.create(req.user.id, createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('user')
  findByUser(@Req() req: Request) {
    return this.postsService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(req.user.id, id, updatePostDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.postsService.remove(req.user.id, id);
  }

  @Patch(':id/like')
  likePost(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.likePost(req.user.id, id);
  }

  @Patch(':id/dislike')
  dislikePost(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.dislikePost(req.user.id, id);
  }
}
