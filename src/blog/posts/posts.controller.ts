import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as BlogPost } from './entities/post.entity';
import { KeycloakAuthGuard } from '../../auth/guards/keycloak-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(KeycloakAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: BlogPost,
  })
  create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.postsService.create(createPostDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({
    status: 200,
    description: 'Return all posts',
    type: [BlogPost],
  })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by id' })
  @ApiResponse({ status: 200, description: 'Return the post', type: BlogPost })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a blog post by slug' })
  @ApiResponse({ status: 200, description: 'Return the post', type: BlogPost })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: BlogPost,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
