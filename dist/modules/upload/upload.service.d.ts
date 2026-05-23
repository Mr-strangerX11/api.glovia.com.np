import { ConfigService } from '@nestjs/config';
export declare const MAX_UPLOAD_SIZE_BYTES: number;
export declare const ALLOWED_IMAGE_MIME_TYPES: string[];
export declare function imageFileFilter(_req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void): void;
export declare class UploadService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<string>;
    uploadMultiple(files: Express.Multer.File[], folder?: string): Promise<string[]>;
    deleteImage(publicId: string): Promise<void>;
}
