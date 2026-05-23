"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
let FirebaseService = class FirebaseService {
    constructor(configService) {
        this.configService = configService;
        this.isInitialized = false;
        this.initializeFirebase();
    }
    initializeFirebase() {
        try {
            const firebaseConfig = {
                apiKey: this.configService.get('FIREBASE_API_KEY'),
                authDomain: this.configService.get('FIREBASE_AUTH_DOMAIN'),
                projectId: this.configService.get('FIREBASE_PROJECT_ID'),
                storageBucket: this.configService.get('FIREBASE_STORAGE_BUCKET'),
                messagingSenderId: this.configService.get('FIREBASE_MESSAGING_SENDER_ID'),
                appId: this.configService.get('FIREBASE_APP_ID'),
                measurementId: this.configService.get('FIREBASE_MEASUREMENT_ID'),
            };
            if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
                console.warn('Firebase config missing. Skipping Firebase init.');
                return;
            }
            try {
                this.firebaseApp = (0, app_1.getApp)();
            }
            catch (error) {
                this.firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
            }
            this.storage = (0, storage_1.getStorage)(this.firebaseApp);
            this.auth = (0, auth_1.getAuth)(this.firebaseApp);
            this.firestore = (0, firestore_1.getFirestore)(this.firebaseApp);
            this.isInitialized = true;
            console.log('Firebase initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize Firebase:', error);
            this.isInitialized = false;
        }
    }
    ensureInitialized() {
        if (!this.isInitialized) {
            throw new Error('Firebase not initialized. Check environment settings.');
        }
    }
    async uploadFile(folder, fileName, file) {
        try {
            this.ensureInitialized();
            const fileRef = (0, storage_1.ref)(this.storage, `${folder}/${fileName}`);
            const result = await (0, storage_1.uploadBytes)(fileRef, file);
            return result.metadata.fullPath;
        }
        catch (error) {
            console.error('File upload failed:', error);
            throw error;
        }
    }
    async downloadFile(filePath) {
        try {
            this.ensureInitialized();
            const fileRef = (0, storage_1.ref)(this.storage, filePath);
            const fileBuffer = await (0, storage_1.getBytes)(fileRef);
            return Buffer.from(fileBuffer);
        }
        catch (error) {
            console.error('File download failed:', error);
            throw error;
        }
    }
    async deleteFile(filePath) {
        try {
            this.ensureInitialized();
            const fileRef = (0, storage_1.ref)(this.storage, filePath);
            await (0, storage_1.deleteObject)(fileRef);
        }
        catch (error) {
            console.error('File deletion failed:', error);
            throw error;
        }
    }
    getAuth() {
        this.ensureInitialized();
        return this.auth;
    }
    getFirestore() {
        this.ensureInitialized();
        return this.firestore;
    }
    getStorage() {
        this.ensureInitialized();
        return this.storage;
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map