import { Module, forwardRef } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UserModule } from 'src/modules/User/user.module';
import { StoreModule } from 'src/modules/Store/store.module';

@Module({
  providers: [UtilsService],
  exports: [UtilsService],
  imports: [forwardRef(() => UserModule), forwardRef(() => StoreModule)],
})
export class UtilsModule {}
