import { Module } from "@nestjs/common";
import { StoreController } from "./store.controller";
import { StoreService } from "./store.service";
import { StoreRepository } from "./repository/store.repository";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../User/user.module";
import { UtilsService } from "src/utils/utils.service";

@Module(
  {
    controllers: [StoreController],
    providers: [StoreService, StoreRepository, UtilsService],
    imports: [AuthModule, UserModule],
    exports: [StoreService]
  }
)
export class StoreModule {}