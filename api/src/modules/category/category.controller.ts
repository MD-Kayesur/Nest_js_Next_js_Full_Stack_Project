import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
 import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { CategoryResponseDto } from './dto/category-response.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { promises } from 'dns';
import { Role } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


  //create category
  @Post()
 @UseGuards(JwtAuthGuard,RolesGuard)
 @Roles(Role.ADMIN)
 @ApiBearerAuth('JWT-auth')
 @ApiOperation({summary:'Create category'})
 @ApiBody({type:CreateCategoryDto})
 @ApiResponse({
  status:201,
  description:'Category created successfully',
})
@ApiResponse({
  status:400,
  description:'Invalid request',
})
@ApiResponse({
  status:500,
  description:'Internal server error',
})
@ApiResponse({
  status:401,
  description:'Unauthorized',
})
@ApiResponse({
  status:409,
  description:'Conflict',
})
@HttpCode(HttpStatus.OK)
  async create (createCategoryDto:CreateCategoryDto):Promise<CategoryResponseDto>{
    return this.categoryService.create(createCategoryDto);
  }
  





  //Get all categories
  @Get()
 @ApiOperation({summary:'Get all categories'})
 @ApiResponse({
  status:200,
  description:'List of categories',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/CategoryResponseDto',
        },
      },
      meta: {
        type: 'object',
        properties: {
          total: {
            type: 'number',
          },
          page: {
            type: 'number',
          },
          limit: {
            type: 'number',
          },
          totalPage: {
            type: 'number',
          },
          
        },
      },
    }
  },

})
 
@ApiResponse({
  status:500,
  description:'Internal server error',
})

  async findAll(@Query() queryDto: QueryCategoryDto) {
    return this.categoryService.findAll(queryDto);
  }










//get category by id

  @Get(':id')
  @ApiOperation({summary:'Get category by id'})
  @ApiResponse({
    status:200,
    description:'Category found successfully',
    type:CategoryResponseDto,
  })
  @ApiResponse({
    status:404,
    description:'Category not found',
  })
  @ApiResponse({
    status:500,
    description:'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string):Promise<CategoryResponseDto> {
    return this.categoryService.findOne(id);
  }



  //get category by slug
  
  @Get('slug/:slug')
  @ApiOperation({summary:'Get category by slug'})
  @ApiResponse({
    status:200,
    description:'Category found successfully',
    type:CategoryResponseDto,
  })
  @ApiResponse({
    status:404,
    description:'Category not found',
  })
  @ApiResponse({
    status:500,
    description:'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string):Promise<CategoryResponseDto> {
    return await this.categoryService.findBySlug(slug);
  }


//update category
  @Patch(':id')
    @UseGuards(JwtAuthGuard,RolesGuard)
 @Roles(Role.ADMIN)
 @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary:'Update category (ADMIN only)'})
  @ApiBody({type:UpdateCategoryDto})
  @ApiResponse({
    status:200,
    description:'Category updated successfully',
    type:CategoryResponseDto,
  })
  @ApiResponse({
    status:404,
    description:'Category not found',
  })
  @ApiResponse({
    status:500,
    description:'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string,  updateCategoryDto: UpdateCategoryDto):Promise<CategoryResponseDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }









//delete category
@Delete(':id')
    @UseGuards(JwtAuthGuard,RolesGuard)
 @Roles(Role.ADMIN)
 @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary:'Delete category (ADMIN only)'})
  @ApiResponse({
    status:200,
    description:'Category deleted successfully',
    type:CategoryResponseDto,
  })
  @ApiResponse({
    status:404,
    description:'Category not found',
  })
  @ApiResponse({
    status:500,
    description:'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string):Promise<{message:string}> {
    return this.categoryService.remove(id);
  }
}
