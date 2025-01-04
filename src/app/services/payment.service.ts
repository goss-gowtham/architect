import { Injectable } from '@angular/core';
import { CardDTO } from '../models/clients.dto';
import { v4 as uuidv4 } from 'uuid';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private testMode = true; // Set to false for production
  private key = 'your_payu_key';
  private salt = 'your_payu_salt';

  initiatePayUPayment(card: CardDTO): Observable<void> {
    const baseUrl = this.testMode ? 'https://test.payu.in/_payment' : 'https://secure.payu.in/_payment';
    const transactionId = uuidv4(); // Generate a unique transaction ID
    const successUrl = `${window.location.origin}/clients?status=success&projectId=${card.projectId}&userId=${card.username}`;
    const failureUrl = `${window.location.origin}/clients?status=failure`;
    const hashString = `${this.key}|${transactionId}|${card.pay}|${card.project}|${card.username}|||||||||||${this.salt}`;

    return this.generateHash(hashString).pipe(
      map(hash => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = baseUrl;

        const fields: any = {
          key: this.key,
          txnid: transactionId,
          amount: card.pay,
          productinfo: card.project,
          firstname: card.username,
          email: 'user@example.com',
          phone: '1234567890',
          surl: successUrl,
          furl: failureUrl,
          hash: hash,
          service_provider: 'payu_paisa'
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
