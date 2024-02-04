import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './modules/User/user.module';
import { APP_PIPE } from '@nestjs/core';
import { ProductModule } from './modules/Product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { User } from './modules/User/entity/user.entity';
import { Product } from './modules/Product/entity/product.entity';

@Module({
  imports: [
    UserModule,
    ProductModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'cadastro_produtos_api',
      entities: [User, Product],
      // synchronize: true não deve ser utilizada em produção
      synchronize: true,

      // autoLoadEntities: true
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
