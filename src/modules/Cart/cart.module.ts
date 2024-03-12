import { Module, forwardRef } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartRepository } from "./repository/cart.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./entity/cart.entity";
import { CartController } from "./cart.controller";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../User/user.module";
import { ProductModule } from "../Product/product.module";
import { JwtService } from "@nestjs/jwt";

@Module({
    controllers: [CartController],
    providers: [CartService, CartRepository, JwtService],
    exports: [CartService, CartRepository],
    imports: [TypeOrmModule.forFeature([Cart]), AuthModule, forwardRef(() => UserModule), forwardRef(() => ProductModule)]
})
export class CartModule {}