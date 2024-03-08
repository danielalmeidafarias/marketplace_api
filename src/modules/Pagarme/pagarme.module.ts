import { Module } from '@nestjs/common';
import { PagarmeService } from './pagarme.service';
import { Axios } from 'axios';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [PagarmeService, Axios],
  exports: [PagarmeService],
  imports: [UtilsModule]
})
export class PagarmeModule {}
