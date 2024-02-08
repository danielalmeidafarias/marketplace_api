import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './modules/User/user.module';
import { APP_PIPE } from '@nestjs/core';
import { ProductModule } from './modules/Product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { AuthModule } from './modules/auth/auth.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    UserModule,
    ProductModule,
    AuthModule,
    TypeOrmModule.forRoot(databaseConfig),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
