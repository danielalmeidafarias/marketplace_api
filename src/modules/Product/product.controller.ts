import { AuthGuard } from './../auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductStoreDTO, CreateProductUserDTO } from './dto/create-product.dto';
import { DeleteProductBodyDTO, DeleteProductStoreQueryDTO, DeleteProductUserQueryDTO } from './dto/delete-product.dto';
import { UpdateProductBodyDTO, UpdateProductStoreQuery, UpdateProductUserQuery } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService,
  ) { }

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(
    @Body()
    { name, price, quantity, access_token, refresh_token }: CreateProductStoreDTO,
  ) {
    return this.productService.createProduct({
      name,
      price,
      quantity,
      access_token,
    });
  }

  @UseGuards(AuthGuard)
  @Post('user/create')
  async createUserStoreProduct(
    @Body() { access_token, refresh_token, name, price, quantity, storeId }: CreateProductUserDTO,
  ) {
    return this.productService.createUserStoreProduct({
      storeId,
      name,
      price,
      quantity,
      access_token,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/update')
  async update(
    @Body()
    {
      access_token,
      refresh_token,
      newName,
      newPrice,
      newQuantity,
    }: UpdateProductBodyDTO,
    @Query() { productId }: UpdateProductStoreQuery
  ) {
    return this.productService.updateProduct({
      access_token,
      productId,
      newName,
      newPrice,
      newQuantity,
    });
  }

  @UseGuards(AuthGuard)
  @Put('/user/update')
  async updateUserStoreProduct(
    @Body()
    {
      access_token,
      refresh_token,
      newName,
      newPrice,
      newQuantity,
    }: UpdateProductBodyDTO,
    @Query() { productId, storeId }: UpdateProductUserQuery,
  ) {
    return this.productService.updateUserStoreProduct({
      productId,
      storeId,
      access_token,
      newName,
      newPrice,
      newQuantity,
    });
  }


  @UseGuards(AuthGuard)
  @Delete('/delete')
  async delete(
    @Body() { access_token, refresh_token }: DeleteProductBodyDTO,
    @Query() { productId }: DeleteProductStoreQueryDTO
  ) {
    return this.productService.deleteProduct({
      productId,
      access_token,
    })
  };

  @UseGuards(AuthGuard)
  @Delete('/user/delete')
  async deleteUserStoreProduct(
    @Body() { access_token, refresh_token }: DeleteProductBodyDTO,
    @Query() { productId, storeId }: DeleteProductUserQueryDTO,
  ) {
    return this.productService.deleteUserStoreProduct({
      productId,
      access_token,
      storeId
    });
  }
}
