import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

declare let Moralis;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username;
  password;
  processingSignin;
  constructor(
    private router: Router,
    private menu: MenuController,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  gotosignup() {
    this.router.navigateByUrl('/signup');
  }

  async login() {
    try {
      const user = await Moralis.User.logIn(this.username, this.password);
      console.log('logged in user:', user);
      localStorage.setItem('authenticated', 'yes');
      this.menu.enable(true);
      this.router.navigateByUrl('/folder/Inbox');
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
}
