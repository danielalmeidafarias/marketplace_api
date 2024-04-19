import { AddressService } from './address.service';
import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../Auth/auth.guard';
import { CreateAddressDTO } from './dto/create-address.dto';
import { GetAddressesDTO } from './dto/get-adresses.dto';
import { DeleteAddressDTO } from './dto/delete-address.dto';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  async createAddress(
    @Body()
    {
      access_token,
      refresh_token,
      cep,
      numero,
      complemento,
    }: CreateAddressDTO,
  ) {
    return await this.addressService.createAddress(
      access_token,
      refresh_token,
      cep,
      numero,
      complemento,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/get')
  async getAddresses(@Body() { access_token, refresh_token }: GetAddressesDTO) {
    return await this.addressService.getAddresses(access_token, refresh_token);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete')
  async deleteAddress(
    @Body() { access_token, refresh_token, address_id }: DeleteAddressDTO,
  ) {
    return this.addressService.deleteAddress(
      access_token,
      refresh_token,
      address_id,
    );
  }
}
