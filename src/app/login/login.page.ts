import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { EventsService } from '../services/events.service';
import { MoralisService } from '../services/moralis.service';

declare let Moralis;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username;
  password;
  processingSignin = false;
  constructor(
    private router: Router,
    private menu: MenuController,
    public toastController: ToastController,
    private moralisService: MoralisService,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    this.username = '';
    this.password = '';
    this.processingSignin = false;
    this.isLoggedIn();
  }

  ionViewWillEnter() {
    this.username = '';
    this.password = '';
    this.processingSignin = false;
    this.isLoggedIn();
  }

  isLoggedIn() {
    if(localStorage.getItem('authenticated') === 'yes') {
      this.menu.enable(true);
      this.router.navigateByUrl('/folder/Inbox');
    }
  }



  async login() {
    try {
      this.processingSignin = true;
      const user = await Moralis.User.logIn(this.username, this.password);
      console.log('logged in user:', user);
      localStorage.setItem('authenticated', 'yes');
      localStorage.setItem('username', this.username);

      const resp = await this.moralisService.getCurrentUser();
      localStorage.setItem('emailId', resp.email);




      localStorage.setItem('email', 'yes');

      this.eventsService.publishSomeData({
        username: this.username,
        email: resp.email

      });

      this.menu.enable(true);
      this.router.navigateByUrl('/listpackages');
    } catch (error) {
      this.processingSignin = false;
      // Show the error message somewhere and let the user try again.
      const msg = 'Error: ' + error.code + ' ' + error.message;
      console.log(msg);
      this.presentToast(msg);
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  clear(){
    this.username = '';
    this.password = '';
  }
}
