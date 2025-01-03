import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/db.service';
import { CardDTO } from '../../services/DTO/clients.dto';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  standalone: false
})
export class ClientsComponent implements OnInit {
  cards: CardDTO[] = [
    { project: 'Project 1', desc: 'Detailed Plan available for download', pay: '200', thumbnail: '', file: '' },
    { project: 'Project 2', desc: 'Detailed Plan available for download', pay: '500', thumbnail: '', file: '' }
  ];
  clientLogo: string = '';

  constructor(private authService: AuthService, private dbService: DbService) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.dbService.getClientLogo(currentUser.client).subscribe((logoUrl: string) => {
        this.clientLogo = logoUrl;
        this.cards.forEach(card => {
          card.thumbnail = this.clientLogo;
        });
      }, (error) => {
        console.error("Error fetching client logo:", error);
      });
    }
  }
}
