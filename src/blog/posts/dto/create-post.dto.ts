import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My First Blog Post' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'my-first-blog-post' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'This is the content of my first blog post...' })
  @IsString()
  content: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiProperty({ example: ['javascript', 'typescript'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
