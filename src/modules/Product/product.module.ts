import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DataSource } from 'typeorm';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {
  constructor(dataSource: DataSource) {}
}
