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

    addClient(clientName: string, logoUrl: string): Observable<void> {
        const dbRef = ref(this.database, 'clients/' + clientName);
        return from(set(dbRef, {
            name: clientName,
            logo: logoUrl
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

    getClientLogo(clientName: string): Observable<string> {
        const dbRef = ref(this.database, 'clients/' + clientName + '/logo');
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("No logo available");
                return '';
            }
        }).catch((error) => {
            console.error("Error getting client logo:", error);
            throw error;
        }));
    }
}