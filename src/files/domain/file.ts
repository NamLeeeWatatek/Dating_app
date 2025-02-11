import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { Transform } from 'class-transformer';
import fileConfig from '../config/file.config';
import { FileConfig, FileDriver } from '../config/file-config.type';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppConfig } from '../../config/app-config.type';
import appConfig from '../../config/app.config';

export class FileType {
  @ApiProperty({
    type: String,
    example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae',
  })
  @Allow()
  id: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/path/to/file.jpg',
  })
  @Transform(
    ({ value }) => {
      const config = fileConfig() as FileConfig;

      if (config.driver === FileDriver.LOCAL) {
        return (appConfig() as AppConfig).backendDomain + value;
      } else if (
        [FileDriver.S3_PRESIGNED, FileDriver.S3].includes(config.driver)
      ) {
        const s3 = new S3Client({
          region: config.awsS3Region ?? '',
          credentials: {
            accessKeyId: config.accessKeyId ?? '',
            secretAccessKey: config.secretAccessKey ?? '',
          },
        });

        const command = new GetObjectCommand({
          Bucket: config.awsDefaultS3Bucket ?? '',
          Key: value,
        });

        return getSignedUrl(s3, command, { expiresIn: 3600 });
      } else if (config.driver === FileDriver.FIREBASE) {
        return `https://storage.googleapis.com/${config.firebaseBucket}/${value}`;
      }

      return value;
    },
    {
      toPlainOnly: true,
    },
  )
  path: string;
}
