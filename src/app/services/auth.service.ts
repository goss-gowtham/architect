import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

login(userDetails: any): void {
    // For demo purposes, let's use a simple hardcoded user validation.
    const validUsers: any = {
        'admin': { password: 'adminpass', roles: ['admin', 'user'] },
        'user': { password: 'userpass', roles: ['user'] },
    };

    const user = validUsers[userDetails?.username];
    if (user && user.password === userDetails?.password) {
        const userData = { username: userDetails?.username, roles: user.roles };
        this.currentUserSubject.next(userData);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
        // Handle invalid login
        console.error('Invalid username or password');
        this.currentUserSubject.next(null);
        sessionStorage.removeItem('currentUser');
    }
}

  logout(): void {
    this.currentUserSubject.next(null);
    sessionStorage.removeItem('currentUser');
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthorized(allowedRoles?: string[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    return user.roles.some(role => allowedRoles?.includes(role));
  }
}