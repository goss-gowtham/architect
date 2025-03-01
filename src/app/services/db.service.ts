import { Injectable } from '@angular/core';
import { ref, get, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { from, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { HttpEventType, HttpClient } from '@angular/common/http'; // Add HttpClient and HttpEventType imports

@Injectable({
    providedIn: 'root'
})
export class DbService {
    private database;
    private storage;

    constructor(private firebaseService: FirebaseService, private http: HttpClient) { // Add HttpClient to constructor
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

    uploadFileWithProgress(file: File, path: string): Observable<any> {
        const storageReference = storageRef(this.storage, path);
        const uploadTask = uploadBytesResumable(storageReference, file);
        return new Observable(observer => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    observer.next({ type: HttpEventType.UploadProgress, loaded: snapshot.bytesTransferred, total: snapshot.totalBytes });
                },
                (error) => {
                    observer.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        observer.next({ type: HttpEventType.Response, body: { downloadURL, fileSize: file.size } });
                        observer.complete();
                    });
                }
            );
        });
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