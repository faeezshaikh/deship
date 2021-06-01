import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { EventsService } from './services/events.service';
import { MoralisService } from './services/moralis.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  username:any;
  email:any;

  public appPages = [
    { title: 'Packages', url: '/listpackages', icon: 'cube' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'News', url: '/news/nytimes', icon: 'warning' },
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private menu:MenuController,private router: Router,
    private eventsService : EventsService,
    private moralisService: MoralisService) {
    this.getCurrentUser();
    this.foo();

  }


  foo() {
    this.eventsService.getObservable().subscribe((data) => {
      console.log('Data received:', data);
      this.username = data.username;
      this.email = data.email;

    });
  }
  async getCurrentUser() {
    // const resp = await this.moralisService.getCurrentUser();
    this.username = localStorage.getItem('username');
    this.email = localStorage.getItem('emailId');
  }

  logout() {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('ethAddr');
    localStorage.removeItem('ethAddrDisp');
    this.menu.enable(false);
    this.router.navigateByUrl('/');

  }

  ionViewWillEnter() {
    this.foo();
  }


}
