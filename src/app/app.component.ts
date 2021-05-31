import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  public appPages = [
    { title: 'Packages', url: '/listpackages', icon: 'cube' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'News', url: '/news/nytimes', icon: 'warning' },
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private menu:MenuController,private router: Router) {

  }

  logout() {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('ethAddr');
    localStorage.removeItem('ethAddrDisp');
    this.menu.enable(false);
    this.router.navigateByUrl('/');

  }

  ionViewWillEnter() {

  }


}
