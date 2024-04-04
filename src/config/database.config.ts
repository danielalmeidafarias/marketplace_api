import 'dotenv/config.js';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from 'src/modules/Product/entity/product.entity';
import { User } from 'src/modules/User/entity/user.entity';
import { Store } from 'src/modules/Store/entity/store.entity';
import { Cart } from 'src/modules/Cart/entity/cart.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: 'cadastro_produtos_api',
  entities: [User, Store, Product, Cart],
  synchronize: true,
  autoLoadEntities: true,
};
