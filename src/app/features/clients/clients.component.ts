import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../services/payment.service';
import { ProjectService } from '../../services/project.service';
import { DbService } from '../../services/db.service';
import { CardDTO } from '../../models/clients.dto';
import { User, Roles } from '../../models/user.dto';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserDetailsFormComponent } from '../../components/user-details-form/user-details-form.component';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

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
    private userService: UserService,
    private paymentService: PaymentService,
    private dbService: DbService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.isAdminOrMaster = currentUser.roles.includes(Roles.admin) || currentUser.roles.includes(Roles.master);
      this.dbService.getClientLogo(currentUser.client).pipe(
        switchMap((logoUrl: string) => {
          this.clientLogo = logoUrl;
          return this.isAdminOrMaster ? this.loadAllUserProjects(currentUser.client) : this.loadCurrentUserProjects(currentUser.id);
        })
      ).subscribe(() => {
        this.route.queryParams.subscribe(params => {
          if (params['status'] || params['projectId'] || params['userId']) {
            this.handleQueryParams(params);
          }
        });
      }, (error: any) => {
        console.error("Error fetching client logo:", error);
      });
    }
  }

  handleQueryParams(params: any) {
    const paymentStatus = params['status'];
    const projectId = params['projectId'];
    const userId = params['userId'];
    if (paymentStatus === 'success' && projectId && userId) {
      this.notification.success('Success', 'Payment successful. You can now download the file.');
      const card = this.cards.find(card => card.projectId === projectId);
      if (card) {
        this.downloadFile(card.file);
      }
    } else if (paymentStatus === 'failure') {
      this.notification.error('Error', 'Payment failed. Please try again.');
    }
  }

  loadAllUserProjects(clientId: string): Observable<void> {
    return this.userService.getUsers(clientId).pipe(
      map((users: User[]) => {
        if (users) {
          this.cards = users.flatMap((user) => user.projects.map(project => ({
            ...project,
            thumbnail: project.thumbnail || this.clientLogo,
            username: user.username
          })));
        }
      }),
      catchError((error) => {
        console.error("Error fetching user projects:", error);
        return of();
      })
    );
  }

  loadCurrentUserProjects(userId: string): Observable<void> {
    return this.userService.getUser(userId).pipe(
      map((user) => {
        if (user) {
          this.cards = user.projects.map(project => ({
            ...project,
            thumbnail: project.thumbnail || this.clientLogo,
            username: user.username
          }));
        }
      }),
      catchError((error) => {
        console.error("Error fetching user projects:", error);
        return of();
      })
    );
  }

  downloadFile(fileUrl: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    const filename = fileUrl.split('/').pop()  || 'download';
    link.download = filename;
    link.target = "_blank";
    link.click();
  }

  handlePayAndDownload(card: CardDTO) {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.notification.error('Error', 'User not authenticated. Please log in.');
      return;
    }

    if (card.paid || this.isAdminOrMaster) {
      this.downloadFile(card.file);
      this.notification.success('Success', 'Downloaded successfully');
    } else {
      this.userService.getUser(currentUser.id).subscribe(user => {
        if (!user) {
          this.notification.error('Error', 'User details not found.');
          return;
        }
        if (!user.email || !user.phone) {
          this.showUserDetailsModal(user, card);
        } else {
          this.initiatePayment(card, user);
        }
      });
    }
  }

  showUserDetailsModal(user: User, card: CardDTO) {
    const modal = this.modal.create({
      nzTitle: 'Personal Details',
      nzContent: UserDetailsFormComponent,
      nzData: { user }, 
      nzOkText: "Pay now",
      nzOnOk: () => {
        const componentInstance = modal.getContentComponent();
        const updatedUser = componentInstance.getUserDetails();
        this.userService.updateUser(updatedUser).subscribe(() => {
          this.initiatePayment(card, updatedUser);
        });
      }
    });
  }

  initiatePayment(card: CardDTO, user: User) {
    this.paymentService.initiatePayUPayment(card, user).subscribe({
      next: () => {
        console.log("Payment initiation complete");
        // Handle any additional logic if needed
      },
      error: (err) => {
        console.error("Error initiating payment:", err);
        this.notification.error('Error', 'Error initiating payment. Please try again.');
      }
    });
  }
}
