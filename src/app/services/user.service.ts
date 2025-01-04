import { Injectable } from '@angular/core';
import { ref, get, set, child, remove } from "firebase/database";
import { CryptoService } from './crypto.service';
import { from, Observable } from 'rxjs';
import { User } from '../models/user.dto';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private database;

    constructor(private cryptoService: CryptoService, private firebaseService: FirebaseService) {
        this.database = this.firebaseService.getDatabase();
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
}