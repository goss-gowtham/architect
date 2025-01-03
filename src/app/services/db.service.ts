import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, child, remove, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { CryptoService } from './crypto.service';
import { from, Observable, of } from 'rxjs';
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

    getClients(): Observable<any> {
        return this.getData('clients');
    }

    addUser(user: User): Observable<void> {
        const dbRef = ref(this.database, 'users');
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                const existingUser = Object.values(users).find((u: any) => u.username === user.username);
                if (existingUser) {
                    throw new Error('Username already exists');
                }
                return this.cryptoService.hashPassword(user.password).then((hashedPassword: string) => {
                    return set(ref(this.database, 'users/' + user.id), {
                        id: user.id,
                        username: user.username,
                        password: hashedPassword,
                        roles: user.roles,
                        client: user.client,
                        projects: user.projects || []
                    });
                });
            } else {
                return this.cryptoService.hashPassword(user.password).then((hashedPassword: string) => {
                    return set(ref(this.database, 'users/' + user.id), {
                        id: user.id,
                        username: user.username,
                        password: hashedPassword,
                        roles: user.roles,
                        client: user.client,
                        projects: user.projects || []
                    });
                });
            }
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

    getUserByUsername(username: string): Observable<User | null> {
        const dbRef = ref(this.database, 'users');
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                const user = Object.values(users).find((user: any) => user.username === username);
                if (user) {
                    return user as User;
                } else {
                    console.log("No user found with the given username");
                    return null;
                }
            } else {
                console.log("No data available");
                return null;
            }
        }).catch((error) => {
            console.error("Error getting user by username:", error);
            throw error;
        }));
    }

    getUser(userId: string): Observable<User | null> {
        const dbRef = child(ref(this.database), `users/${userId}`);
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val() as User;
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

    addProjectToUser(userId: string, project: any): Observable<void> {
        const dbRef = ref(this.database, `users/${userId}/projects`);
        return from(get(dbRef).then((snapshot) => {
            const projects = snapshot.exists() ? snapshot.val() : [];
            projects.push(project);
            return update(ref(this.database, `users/${userId}`), { projects });
        }).catch((error) => {
            console.error("Error adding project to user:", error);
            throw error;
        }));
    }
}