import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/db.service';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../services/payment.service';
import { ProjectService } from '../../services/project.service';
import { CardDTO } from '../../models/clients.dto';
import { User, Roles } from '../../models/user.dto';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  standalone: false
})
export class ClientsComponent implements OnInit {
  cards: CardDTO[] = [];
  clientLogo: string = '';
  isAdminOrMaster: boolean = false;

  constructor(
    private authService: AuthService,
    private dbService: DbService,
    private userService: UserService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.isAdminOrMaster = currentUser.roles.includes(Roles.admin) || currentUser.roles.includes(Roles.master);
      this.dbService.getClientLogo(currentUser.client).subscribe((logoUrl: string) => {
        this.clientLogo = logoUrl;
        if (this.isAdminOrMaster) {
          this.loadAllUserProjects(currentUser.client);
        } else {
          this.loadCurrentUserProjects(currentUser.id);
        }
      }, (error) => {
        console.error("Error fetching client logo:", error);
      });
    }

    this.route.queryParams.subscribe(params => {
      const paymentStatus = params['status'];
      const projectId = params['projectId'];
      const userId = params['userId'];
      if (paymentStatus === 'success' && projectId && userId) {
        this.projectService.updateProjectPaymentStatus(userId, projectId, true).subscribe(() => {
          this.notification.success('Success', 'Payment successful. You can now download the file.');
          this.downloadFile(this.cards.find(card => card.projectId === projectId)?.file || '');
        }, (error: any) => {
          console.error("Error updating payment status:", error);
        });
      } else if (paymentStatus === 'failure') {
        this.notification.error('Error', 'Payment failed. Please try again.');
      }
    });
  }

  loadAllUserProjects(clientId: string) {
    this.userService.getUsers(clientId).subscribe((users: User[]) => {
      if (users) {
        this.cards = users.flatMap((user) => user.projects.map(project => ({
          ...project,
          thumbnail: this.clientLogo,
          username: user.username
        })));
      }
    }, (error) => {
      console.error("Error fetching user projects:", error);
    });
  }

  loadCurrentUserProjects(userId: string) {
    this.userService.getUser(userId).subscribe((user) => {
      if (user) {
        this.cards = user.projects.map(project => ({
          ...project,
          thumbnail: this.clientLogo,
          username: user.username
        }));
      }
    }, (error) => {
      console.error("Error fetching user projects:", error);
    });
  }

  downloadFile(fileUrl: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'download';
    link.click();
  }

  handlePayAndDownload(card: CardDTO) {
    if (card.paid || this.isAdminOrMaster) {
      this.downloadFile(card.file);
      this.notification.success('Success', 'Downloaded successfully');
    } else {
      this.paymentService.initiatePayUPayment(card).subscribe({
        next: () => {
          console.log("Payment initiation complete");
        },
        error: (err) => {
          console.error("Error initiating payment:", err);
          this.notification.error('Error', 'Error initiating payment. Please try again.');
        }
      });
    }
  }
}
