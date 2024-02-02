import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { GetProductDTO } from './dto/get-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { DeleteProductDTO } from './dto/delete-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async create(
    @Body()
    { name, price, quantity, access_token, refresh_token }: CreateProductDTO,
  ) {
    return this.productService.createProduct(
      { name, price, quantity },
      { access_token, refresh_token },
    );
  }

  @Put()
  async edit(
    @Body()
    { id, access_token, refresh_token, name, price, quantity }: EditProductDto,
  ) {
    return this.productService.editProduct(
      { id },
      { name, price, quantity },
      { access_token, refresh_token },
    );
  }

  @Delete()
  async delete(@Query() { id, access_token, refresh_token }: DeleteProductDTO) {
    return this.productService.deleteProduct(
      { id },
      { access_token, refresh_token },
    );
  }

  @Get()
  async get(@Query() { id }: GetProductDTO) {
    return this.productService.getProduct({ id });
  }
}
