import { Injectable } from '@angular/core';
import { ref, get, set, child, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage"; // Add import
import { CryptoService } from './crypto.service';
import { from, Observable } from 'rxjs';
import { User } from '../models/user.dto';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private database;
    private storage; // Add storage

    constructor(private cryptoService: CryptoService, private firebaseService: FirebaseService) { // Remove HttpClient
        this.database = this.firebaseService.getDatabase();
        this.storage = this.firebaseService.getStorage(); // Initialize storage
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
                        projects: user.projects || [],
                        storageUsage: 0 // Initialize storage usage
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
                        projects: user.projects || [],
                        storageUsage: 0 // Initialize storage usage
                    });
                });
            }
        }).catch((error: any) => {
            console.error("Error adding user:", error);
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
        return from(get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const user = snapshot.val();
                const deleteFilePromises = user.projects ? user.projects.map((project: any) => {
                    const fileRef = storageRef(this.storage, project.file);
                    return deleteObject(fileRef);
                }) : [];
                return Promise.all(deleteFilePromises).then(() => remove(dbRef));
            } else {
                throw new Error("User not found");
            }
        }).then(() => {
            console.log("User and associated files deleted successfully");
        }).catch((error) => {
            console.error("Error deleting user:", error);
            throw error;
        }));
    }

    updateUser(user: User): Observable<void> {
        return from(set(ref(this.database, 'users/' + user.id), user).then(() => {
            console.log("User updated successfully");
        }).catch((error) => {
            console.error("Error updating user:", error);
            throw error;
        }));
    }

    // Update this method to use Firebase for updating the user's password
    updateUserPassword(userId: string, newPassword: string): Observable<void> {
        return from(this.cryptoService.hashPassword(newPassword).then((hashedPassword: string) => {
            return set(ref(this.database, 'users/' + userId + '/password'), hashedPassword).then(() => {
                console.log("Password updated successfully");
            }).catch((error) => {
                console.error("Error updating password:", error);
                throw error;
            });
        }));
    }

    updateUserStorageUsage(userId: string, fileSize: number): Observable<void> {
        const dbRef = ref(this.database, `users/${userId}/storage`);
        return from(get(dbRef).then((snapshot) => {
            const currentUsage = snapshot.exists() ? snapshot.val() : 0;
            const newUsage = currentUsage + fileSize;
            return set(dbRef, newUsage);
        }).catch((error) => {
            console.error("Error updating storage usage:", error);
            throw error;
        }));
    }
}