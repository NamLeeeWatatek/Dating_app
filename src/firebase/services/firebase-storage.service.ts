import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseStorageService {
  constructor() {
    if (admin.apps.length === 0) {
      const firebaseConfig = {
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url:
          process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      };

      admin.initializeApp({
        credential: admin.credential.cert(
          firebaseConfig as admin.ServiceAccount,
        ),
        storageBucket: process.env.FIREBASE_BUCKET,
      });
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);

    await file
      .delete()
      .then(() => {
        console.log(`File ${filePath} deleted successfully.`);
      })
      .catch((error) => {
        console.error('Error deleting file:', error);

        throw new Error(`Unable to delete file: ${filePath}`);
      });
  }
}
