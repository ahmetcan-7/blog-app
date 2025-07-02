import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cache as CacheDecorator } from '../../cache/cache.decorator';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      author: { id: userId },
    });
    const savedPost = await this.postRepository.save(post);
    // Invalidate posts cache
    await this.cacheManager.del('cache:/posts');
    return savedPost;
  }

  @CacheDecorator({ key: 'all_posts' })
  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  @CacheDecorator({ key: 'post_by_id' })
  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  @CacheDecorator({ key: 'post_by_slug' })
  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, updatePostDto);
    const updatedPost = await this.postRepository.save(post);
    // Invalidate posts cache
    await this.cacheManager.del('cache:/posts');
    return updatedPost;
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
    // Invalidate posts cache
    await this.cacheManager.del('cache:/posts');
  }
}
