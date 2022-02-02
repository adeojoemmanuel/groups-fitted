import { Module } from '@nestjs/common';
import { ImageUploaderService } from './imageUploader.service';

@Module({
  providers: [ImageUploaderService],
  exports: [ImageUploaderService],
})
export class ImageUploaderModule {}
