import { Module, forwardRef } from '@nestjs/common';
import { PagarmeService } from './pagarme.service';
import { Axios } from 'axios';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [PagarmeService, Axios],
  exports: [PagarmeService],
  imports: [forwardRef(() => UtilsModule)]
})
export class PagarmeModule {}
