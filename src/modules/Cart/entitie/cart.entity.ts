import { UUID } from "crypto";
import { JSONValue } from "postgres";
import { Product } from "src/modules/Product/entity/product.entity";
import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: UUID

    // @ManyToMany(() => Product)
    // @JoinColumn()
    @Column('varchar', { array: true, default: [] })
    products: string[]
}