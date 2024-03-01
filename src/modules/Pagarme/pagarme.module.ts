import { Module } from '@nestjs/common';
import { PagarmeService } from './pagarme.service';
import { Axios } from 'axios';

@Module({
  providers: [PagarmeService, Axios],
  exports: [PagarmeService],
})
export class PagarmeModule {}
