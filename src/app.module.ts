import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './modules/User/user.module';
import { APP_PIPE } from '@nestjs/core';
import { ProductModule } from './modules/Product/product.module';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
