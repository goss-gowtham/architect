import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, child, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { CryptoService } from './crypto.service';
import { from, Observable } from 'rxjs';
import { User } from '../models/user.dto';

@Injectable({
    providedIn: 'root'
})
export class DbService {
    firebaseConfig = {
        databaseURL: "https://architect-design-7-default-rtdb.asia-southeast1.firebasedatabase.app/",
        storageBucket: "gs://architect-design-7.firebasestorage.app"
    };
    app;
    database;
    storage;

    constructor(private cryptoService: CryptoService) {
        this.app = initializeApp(this.firebaseConfig);
        this.database = getDatabase(this.app);
        this.storage = getStorage(this.app);
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

    getRoles(): Observable<string[]> {
        return this.getData('roles');
    }

    getClients(): Observable<any> {
        return this.getData('clients');
    }

    addUser(user: User): Observable<void> {
        const dbRef = ref(this.database, 'users/' + user.id);
        return from(this.cryptoService.hashPassword(user.password).then((hashedPassword: string) => {
            return set(dbRef, {
                id: user.id,
                username: user.username,
                password: hashedPassword,
                roles: user.roles,
                client: user.client
            });
        }).catch((error: any) => {
            console.error("Error adding user:", error);
            throw error;
        }));
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

    getUser(userId: string, client: string): Observable<any> {
        const dbRef = child(ref(this.database), `users/${userId}`);
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const user = snapshot.val();
                if (user.client === client) {
                    return user;
                } else {
                    console.error("Access denied: Admins can only view users related to their client");
                    return null;
                }
            } else {
                console.log("No data available");
                return null;
            }
        }).catch((error) => {
            console.error("Error getting user:", error);
            throw error;
        }));
    }

    getUsers(client: string | null): Observable<any[]> {
        const dbRef = ref(this.database, 'users');
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                return client ? Object.values(users).filter((user: any) => user.client === client) : Object.values(users);
            } else {
                console.log("No data available");
                return [];
            }
        }).catch((error) => {
            console.error("Error getting users:", error);
            throw error;
        }));
    }

    deleteUser(userId: string): Observable<void> {
        const dbRef = ref(this.database, 'users/' + userId);
        return from(remove(dbRef).then(() => {
            console.log("User deleted successfully");
        }).catch((error) => {
            console.error("Error deleting user:", error);
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