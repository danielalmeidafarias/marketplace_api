import { Module } from "@nestjs/common";
import { AddressController } from "./address.controller";
import { PagarmeModule } from "../Pagarme/pagarme.module";
import { AddressService } from "./address.service";
import { UtilsModule } from "../utils/utils.module";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";

@Module({ 
  controllers: [AddressController],
  providers: [AddressService, JwtService],
  imports: [PagarmeModule, AuthModule, UtilsModule]
})
export class AddressModule {

}