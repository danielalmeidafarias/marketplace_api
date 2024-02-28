import { Module } from '@nestjs/common';
import { StoreModule } from './modules/Store/store.module';
import { ProductModule } from './modules/Product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { AuthModule } from './modules/auth/auth.module';
import { databaseConfig } from './config/database.config';
@Module({
  imports: [
    StoreModule,
    ProductModule,
    AuthModule,
    StoreModule,
    TypeOrmModule.forRoot(databaseConfig),
  ],
  // providers: [
  //   {
  //     provide: APP_PIPE,
  //     useClass: ValidationPipe,
  //     useFactory(...args) {
  //       new ValidationPipe({
  //         whitelist: true,
  //         forbidNonWhitelisted: true
  //       })
  //     },
  //   },
  // ],
})
export class AppModule {}
