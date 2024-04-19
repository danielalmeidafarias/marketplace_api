import { Module, forwardRef } from '@nestjs/common';
import { AddressController } from './address.controller';
import { PagarmeModule } from '../Pagarme/pagarme.module';
import { AddressService } from './address.service';
import { AuthModule } from '../Auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AddressController],
  providers: [AddressService, JwtService],
  imports: [forwardRef(() => PagarmeModule), forwardRef(() => AuthModule)],
})
export class AddressModule {}
