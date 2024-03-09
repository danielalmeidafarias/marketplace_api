import { Body, Controller, Post, Query, UseGuards } from "@nestjs/common";
import { AddProductBodyDTO, AddProductQueryDTO } from "./dto/add-product.dto";
import { CartService } from "./cart.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller()
export class CartController {
    constructor(private cartService: CartService) {}

    @UseGuards(AuthGuard)
    @Post('/user/cart/add')
    async addProduct(@Body() { productId, access_token, refresh_token }: AddProductBodyDTO) {
        return this.cartService.addUserCartProduct(access_token, productId)
    }

}