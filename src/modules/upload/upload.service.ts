import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function imageFileFilter(
  _req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void
) {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP allowed'),
      false
    );
  }

  callback(null, true);
}

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'glovia'): Promise<string> {
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new BadRequestException('Image upload is not configured. Set Cloudinary credentials.');
    }

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size && file.size > MAX_UPLOAD_SIZE_BYTES) {
      throw new BadRequestException('File too large. Maximum size is 5MB');
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP allowed');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            { width: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            reject(new BadRequestException(error?.message || 'Upload failed'));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMultiple(files: Express.Multer.File[], folder: string = 'glovia'): Promise<string[]> {
    if (files.some((file) => file.size && file.size > MAX_UPLOAD_SIZE_BYTES)) {
      throw new BadRequestException('One or more files exceed the 5MB limit');
    }

    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new BadRequestException('Failed to delete image');
    }
  }
}
