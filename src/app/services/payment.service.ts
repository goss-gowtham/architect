import { Injectable } from '@angular/core';
import { CardDTO } from '../models/clients.dto';
import { v4 as uuidv4 } from 'uuid';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DbService } from './db.service';
import { User } from '../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private testMode = true; // Set to false for production
  private key = 'KfPgjF';
  private salt = 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDITVAeH89oo1hL+8eMcnrZjjKPiW7StfX3WA6gwh/VORR2Cat6EB6YEwFj+rQCJAcXRcjoE2rtruBEfWJlKpZ0ohiYqUOQjrTONgjwbqYwJU3LaCD2dY7PDMCPoylKIv5GO1WLdLQJBc7CQkcNag7gnEDGVLseO65dx2WdnsJQOJij+RdrmiTjrL+OXTCKihWgU06k/Q7Y4JfdPXSjiwYcOnHTpSYrYbBdVWyz+RBJM84ZzIDRHkQFEhSL9Nu98uyINrpyB3wQegDZltCbxD0sb8JP3KSCkBnBiXO56wvWUcg36XkxqWHBVBP0ZgymIHMGaLzWX6FYcUh4HGmRQiRbAgMBAAECggEAFtC/pH7JGEkq4JTQWQ4dMjTBS5pC9ltlpgPwvpz+FUKIMx3M232Ejpvzl5jR8kB6UktPpCe6EVLPFt4VXCKquqRQGuuE1615qNd80y43XdqR7u5wesJPPwRb1sCmDlzIC+XsS5NCgpiXwYbdIwkGos0Jj83M9pejt+jjiT2xMoPcFCL1hUsuNBORvyOZBGaajPC9goO1NJCmrtnik6Gzx+UOR6ZiOjj50so7kYbg0QUHa28nLf8B/JhL4DL9nKHNBV2qEYl3v3YLoA2FP9qne8fOL1Ml75zK+sR8eiinBmOl0OQcNkBOsFsUEiMDNO+74PlpbwPotedojH7ErYkH0QKBgQD12uCmw8C4MzOwT5SjlkXyIWGai9AuWXTmWW9KwHjftTmwRp+X7gS8bWtLdIYd4L3rUIoCNvKmRNxaQMuN80fFgJ/Ofy6nfJq7ShPm//RFknLY/WvNi9gb4pDxqn5GnMfMbMD+JMBz6y75ADBPSJVmeqUv9oAbP+NObja27dXo4wKBgQDQkTrzcSCZvfU97bO6qtKhGAUQVrl0f6Gg3YgWbMiTmzP7/zIkJkbVAzhFrPd6n/PUkqUisN28j1UFe2Hk+EO8TY8NuH7efag6V+Ht2SHZIlQWGs42K5u/eN0H2dHlL0vn0P2TfTy1tbYeCHCtoGIKXHadxDiPDYrXKmWA1YBIKQKBgQCRYabqtmLmCdEM92IsAhbGgZrX6slmPxvzgvtetsZDc0Tzyi9hhixiyElkSzlrvZRQ7EVP3fJLA/lRnXNBM5VDYzYcw/RwsixFiB6QwNZPtbQYQHNZDtLyWl3fqjQVyWwUpFLTdiQf5/jU4ZmvqHpAKVI5NIi4lGTz4hSUw7t0hQKBgA7x2R+Ig6WAjwoY9j/x7ZXNes9o53EJlDNKrG2u7dBl1pu/9X/RnlG1IVscwb7vpzEcMOkDc2AHhTgXVzRo9bGQfSemiLC4oE1N7sp0PJCqfQv4b75B8a8Oogfl+7xIX1AFEaZ32tnKY3pTcH+AdoX3iihT3xmhBsnUJ+HLap3BAoGBAO1E7ky8VwbI4fhjaiAceocDdUhYsalhZZqZfQQ8+jjwfxRH8z1amiQxpSXNOV25rHur/3lKcYj1IBVeCiJlemQr6+ZW41e2QelOJ4OdCQ77SdQq1TgklVPSPDZTitL+MkredR2ki/MYSlDY7PyUmgU5AfkMpUgnfBC/+jeggJGo';

  constructor(private http: HttpClient, private dbService: DbService) {}

  initiatePayUPayment(card: CardDTO, user: User): Observable<void> {
    const baseUrl = this.testMode ? 'https://test.payu.in/_payment' : 'https://secure.payu.in/_payment';
    const transactionId = uuidv4(); // Generate a unique transaction ID
    const refererUrl = window.location.origin;
    const successUrl = `https://us-central1-architect-design-7.cloudfunctions.net/updatePaidProjects?userId=${user.id}&projectId=${card.projectId}&tranId=${transactionId}&referer=${encodeURIComponent(refererUrl)}`;
    const failureUrl = `${window.location.origin}/architect/clients?status=failure`;
    const hashString = `${this.key}|${transactionId}|${card.pay}|${card.project}|${card.username}|${user.email}|||||||||||${this.salt}`;

    return this.generateHash(hashString).pipe(
      map(hash => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = baseUrl;
        form.target = '_self';

        const fields: any = {
          key: this.key,
          txnid: transactionId,
          amount: card.pay,
          productinfo: card.project,
          firstname: card.username,
          email: user.email,
          phone: user.phone,
          surl: successUrl,
          furl: failureUrl,
          hash: hash,
          service_provider: '',
          referer: refererUrl
        };

        Object.keys(fields).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = fields[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      })
    );
  }

  private generateHash(hashString: string): Observable<string> {
    const buffer = new TextEncoder().encode(hashString);
    return from(crypto.subtle.digest('SHA-512', buffer)).pipe(
      map(hashBuffer => this.bufferToHex(hashBuffer))
    );
  }

  private bufferToHex(buffer: ArrayBuffer): string {
    return Array.prototype.map.call(new Uint8Array(buffer), (x: number) => ('00' + x.toString(16)).slice(-2)).join('');
  }
}
