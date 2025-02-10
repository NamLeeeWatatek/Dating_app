import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileRepository } from '../../persistence/file.repository';
import { FileType } from '../../../domain/file';
import { FirebaseStorageService } from '../../../../firebase/services/firebase-storage.service';

@Injectable()
export class FilesFirebaseService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

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
    const { fileUrl } = await this.firebaseStorageService.uploadFile(
      file,
      file.path,
    );

    // 2. Lưu vào database với `path` là URL Firebase
    const savedFile = await this.fileRepository.create({ path: fileUrl });

    return { file: savedFile };
  }
}
