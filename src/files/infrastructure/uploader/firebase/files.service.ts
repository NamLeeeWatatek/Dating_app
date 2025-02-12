import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileRepository } from '../../persistence/file.repository';
import { FileType } from '../../../domain/file';
import { FirebaseStorageService } from '../../../../firebase/services/firebase-storage.service';
import * as admin from 'firebase-admin';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class FilesFirebaseService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ fileUrl: string; filePath: string }> {
    const bucket = admin.storage().bucket();
    const fileName = `${folder}/${Date.now()}_${file.originalname}`;

    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidV4(),
        },
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        const filePath = fileName;

        resolve({
          fileUrl: publicUrl,
          filePath,
        });
      });

      stream.end(file.buffer);
    });
  }
  async create(file: Express.Multer.File): Promise<{ file: FileType }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'selectFile',
        },
      });
    }

    // 1. Upload file lên Firebase và lấy URL public
    const { fileUrl } = await this.uploadFile(file, file.path);

    // 2. Lưu vào database với `path` là URL Firebase
    const savedFile = await this.fileRepository.create({ path: fileUrl });

    return { file: savedFile };
  }
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<string[]> {
    const bucket = admin.storage().bucket();

    const uploadPromises = files.map((file) => {
      const fileName = `${folder}/${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuidV4(),
          },
        },
      });

      return new Promise<string>((resolve, reject) => {
        stream.on('error', (error) => {
          reject(error);
        });

        stream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
          resolve(publicUrl);
        });

        stream.end(file.buffer);
      });
    });

    return Promise.all(uploadPromises);
  }
  async createMultiple(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<{ files: FileType[] }> {
    if (!files || files.length === 0) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          files: 'selectFiles',
        },
      });
    }

    // 1. Upload tất cả file lên Firebase
    const fileUrls = await this.uploadFiles(files, folder);

    // 2. Lưu vào database với danh sách fileUrl
    const savedFiles = await Promise.all(
      fileUrls.map((fileUrl) => this.fileRepository.create({ path: fileUrl })),
    );

    return { files: savedFiles };
  }
}
