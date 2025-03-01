import { Injectable } from '@angular/core';
import { ref, get, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { from, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root'
})
export class DbService {
    private database;
    private storage;

    constructor(private firebaseService: FirebaseService) {
        this.database = this.firebaseService.getDatabase();
        this.storage = this.firebaseService.getStorage();
    }

    getData(path: string): Observable<any> {
        const dbRef = ref(this.database, path);
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("No data available");
                return null;
            }
        }).catch((error) => {
            console.error("Error getting data:", error);
            throw error;
        }));
    }

    setData(path: string, data: any): Observable<void> {
        const dbRef = ref(this.database, path);
        return from(set(dbRef, data).catch((error: any) => {
            console.error("Error setting data:", error);
            throw error;
        }));
    }

    getClients(): Observable<any> {
        return this.getData('clients');
    }

    addClient(client: { clientName: string, logoUrl: string, key: string, salt: string }): Observable<void> {
        const dbRef = ref(this.database, 'clients/' + client.clientName);
        return from(set(dbRef, {
            name: client.clientName,
            logo: client.logoUrl,
            key: client.key,
            salt: client.salt,
            live: true // Initialize with false
        }).catch((error: any) => {
            console.error("Error adding client:", error);
            throw error;
        }));
    }

    uploadFile(file: File, path: string): Observable<string> {
        const storageReference = storageRef(this.storage, path);
        return from(uploadBytes(storageReference, file).then(() => {
            return getDownloadURL(storageReference);
        }).catch((error) => {
            console.error("Error uploading file:", error);
            throw error;
        }));
    }

    getClientDetails(clientName: string): Observable<{ logo: string, key: string, salt: string, live: boolean }> {
        const dbRef = ref(this.database, 'clients/' + clientName);
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("No logo available");
                return '';
            }
        }).catch((error) => {
            console.error("Error getting client details:", error);
            throw error;
        }));
    }
}