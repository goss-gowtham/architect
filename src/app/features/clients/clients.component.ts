import { Component } from '@angular/core';
import { CardDTO } from '../../services/DTO/clients.dto';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  standalone: false
})
export class ClientsComponent {
  cards: CardDTO[] = [
    { project: 'Project 1', desc: 'Detailed Plan available for download', pay: '200', thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png', file: '' },
    { project: 'Project 2', desc: 'Detailed Plan available for download', pay: '500', thumbnail: '', file: '' }
  ];
}
