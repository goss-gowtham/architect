import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CryptoService } from './crypto.service';
import { DbService } from './db.service';
import { switchMap, map } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  roles: string[];
  client: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private cryptoService: CryptoService, private dbService: DbService) {
    const storedUser = sessionStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(userDetails: any): Observable<boolean> {
    return this.dbService.getUserByUsername(userDetails?.username).pipe(
      switchMap(user => this.cryptoService.hashPassword(userDetails?.password).then(hashedPassword => {
        if (user && user.password === hashedPassword) {
          const userData = { id: user.id, username: user.username, roles: user.roles, client: user.client };
          this.currentUserSubject.next(userData);
          sessionStorage.setItem('currentUser', JSON.stringify(userData));
          return true;
        }
        return false;
      })),
      map(success => {
        if (!success) {
          console.error('Invalid username or password');
          this.currentUserSubject.next(null);
          sessionStorage.removeItem('currentUser');
        }
        return success;
      })
    );
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