import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/db.service';
import { CardDTO } from '../../models/clients.dto';
import { User } from '../../models/user.dto';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  standalone: false
})
export class ClientsComponent implements OnInit {
  cards: CardDTO[] = [];
  clientLogo: string = '';

  constructor(private authService: AuthService, private dbService: DbService) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.dbService.getClientLogo(currentUser.client).subscribe((logoUrl: string) => {
        this.clientLogo = logoUrl;
        this.dbService.getUser(currentUser.id).subscribe((user: User | null) => {
          if (user) {
            this.cards = user.projects.map(project => ({
              ...project,
              thumbnail: this.clientLogo
            }));
          }
        }, (error) => {
          console.error("Error fetching user projects:", error);
        });
      }, (error) => {
        console.error("Error fetching client logo:", error);
      });
    }
  }

  downloadFile(fileUrl: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'download';
    link.click();
  }
}
