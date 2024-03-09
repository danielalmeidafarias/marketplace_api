import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Cart } from "../entitie/cart.entity";
import { Product } from "src/modules/Product/entity/product.entity";
import { UUID } from "crypto";

@Injectable()
export class CartRepository {
    constructor(private dataSource: DataSource) { }
    async create() {
        try {
            const cart = await this.dataSource.getRepository(Cart).createQueryBuilder().insert().values({}).execute()
            return { cartId: cart.identifiers[0].id }
        } catch (err) {
            console.error(err)
            throw new HttpException("Ocorreu um erro ao criar o carrinho", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getCart(cartId: UUID) {
        try {
            const cart = await this.dataSource.getRepository(Cart).createQueryBuilder().where("id = :cartId", { cartId }).getOne()
            return cart
        } catch (err) {
            console.error(err)
            throw new HttpException(`Não foi encontrado nenhum carrinho com o id ${cartId}`, HttpStatus.BAD_REQUEST)
        }
    }

    async addProduct(cartId: UUID, productId: string) {
        try {
            const cart = await this.getCart(cartId)
            const products = cart.products
            await this.dataSource.getRepository(Cart).createQueryBuilder().where('id = :cartId', { cartId }).update({
                products: [...products, productId]
            }).execute()

        } catch (err) {
            console.error(err)
            throw new HttpException("Ocorreu um erro ao tentar adicionar o produto ao carrinho", HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}