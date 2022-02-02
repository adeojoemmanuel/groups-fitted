import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { config } from '../../config';
@Injectable()
export class ImageUploaderService {
  constructor() {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      apiKey: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });
  }

  async uploadEventImage(file): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const cld_upload_stream = cloudinary.uploader.upload_stream(
        {
          folder: `event_images/`,
        },
        (error, result): void => {
          if (result) resolve(result);
          else reject(error);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
    });
  }

  async uploadMeasurementImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const cld_upload_stream = cloudinary.uploader.upload_stream(
        {
          folder: `${userId}/measurements/`,
        },
        (error, result): void => {
          if (result) resolve(result);
          else reject(error);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
    });
  }

  async deleteImage(imagePublicId: string): Promise<boolean> {
    try {
      await cloudinary.uploader.destroy(imagePublicId);
      return true;
    } catch (e: any) {
      console.log(e);
      return false;
    }
  }

  // async deleteEventImage(imagePublicId: string): Promise<boolean> {
  //   try {
  //     await cloudinary.uploader.destroy(imagePublicId);
  //     return true;
  //   } catch (e: any) {
  //     console.log(e);
  //     return false;
  //   }
  // }

  //   async uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
  //     return new Promise((resolve, reject) => {
  //       const uploadStream = cloudinary.uploader.upload_stream(
  //         {
  //           folder: 'events',
  //           upload_preset: 'ml_default',
  //         },
  //         (error: Error, result: UploadApiResponse) => {
  //           if (result) resolve(result);
  //           else reject(error);
  //         },
  //       );
  //       streamifier.createReadStream(buffer).pipe(uploadStream);
  //     });
  //   }
}
