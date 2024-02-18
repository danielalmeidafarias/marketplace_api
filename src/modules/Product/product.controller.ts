import { AuthGuard } from './../auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { GetProductDTO } from './dto/get-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { DeleteProductDTO } from './dto/delete-product.dto';
import { SearchProductDTO } from './dto/search-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(
    @Body()
    {
      name,
      price,
      quantity,
      access_token,
      refresh_token,
    }: CreateProductDTO,
  ) {
    return this.productService.createProduct({
      name: name.toUpperCase(),
      price,
      quantity,
      access_token,
      refresh_token,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/edit')
  async edit(
    @Body()
    {
      id,
      userId,
      access_token,
      refresh_token,
      newName,
      newPrice,
      newQuantity,
    }: EditProductDto,
  ) {
    return this.productService.editProduct({
      id,
      userId,
      access_token,
      refresh_token,
      newName,
      newPrice,
      newQuantity,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/delete')
  async delete(
    @Query() { id, userId, access_token, refresh_token }: DeleteProductDTO,
  ) {
    return this.productService.deleteProduct({
      id,
      userId,
      access_token,
      refresh_token,
    });
  }

  @Get()
  async get(@Query() { id }: GetProductDTO) {
    return this.productService.getProduct(id);
  }

  @Get('/search')
  async searchProducts(@Query() name: SearchProductDTO) {
    return this.productService.searchProduct(name);
  }
}
