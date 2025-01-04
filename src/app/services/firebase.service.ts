
import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private firebaseConfig = {
        databaseURL: "https://architect-design-7-default-rtdb.asia-southeast1.firebasedatabase.app/",
        storageBucket: "gs://architect-design-7.firebasestorage.app"
    };
    private app: FirebaseApp;
    private database: Database;
    private storage: FirebaseStorage;

    constructor() {
        this.app = initializeApp(this.firebaseConfig);
        this.database = getDatabase(this.app);
        this.storage = getStorage(this.app);
    }

    getApp(): FirebaseApp {
        return this.app;
    }

    getDatabase(): Database {
        return this.database;
    }

    getStorage(): FirebaseStorage {
        return this.storage;
    }
}