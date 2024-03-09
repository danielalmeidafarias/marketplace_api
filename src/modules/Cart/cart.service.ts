import { Injectable } from "@nestjs/common";
import { CartRepository } from "./repository/cart.repository";
import { UUID } from "crypto";
import { Product } from "../Product/entity/product.entity";
import { AuthService } from "../auth/auth.service";
import { UserRepository } from "../User/repository/user.repository";
import { ProductRepository } from "../Product/repository/product.repository";

@Injectable()
export class CartService {
    constructor(
        private cartRepository: CartRepository,
        private authService: AuthService,
        private userRepository: UserRepository,
        private productRepository: ProductRepository) { }

    async createCart() {
        return await this.cartRepository.create()
    }

    async getCart() { }

    async getSubtotal() { }

    async deleteCart() { }

    async addUserCartProduct(access_token: string, productId: UUID) {

        const { newAccess_token, newRefresh_token } =
            await this.authService.getNewTokens(access_token);
        const id = await this.authService.getTokenId(newAccess_token);
        const user = await this.userRepository.verifyExistingUserById(id);
        await this.authService.verifyTokenId(access_token, user.id);

        const cartId = user.cartId

        const product = await this.productRepository.findOneById(productId)

        await this.cartRepository.addProduct(cartId, productId)
    }

    async removeProduct() { }

    async clearCart() { }

}