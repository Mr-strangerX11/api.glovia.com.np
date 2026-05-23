import { ConfigService } from '@nestjs/config';
export declare class FirebaseService {
    private configService;
    private firebaseApp;
    private storage;
    private auth;
    private firestore;
    private isInitialized;
    constructor(configService: ConfigService);
    private initializeFirebase;
    private ensureInitialized;
    uploadFile(folder: string, fileName: string, file: Buffer): Promise<string>;
    downloadFile(filePath: string): Promise<any>;
    deleteFile(filePath: string): Promise<void>;
    getAuth(): any;
    getFirestore(): any;
    getStorage(): any;
}
