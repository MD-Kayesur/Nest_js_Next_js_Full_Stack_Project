import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { CategoryResponseDto } from './dto/category-response.dto';

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
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
