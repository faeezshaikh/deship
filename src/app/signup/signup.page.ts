
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare function signup(username,pass,email): void;
import { ToastController } from '@ionic/angular';
declare let Moralis;


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  username;
  password;
  email;
  processingSignin=false;

  constructor(public toastController: ToastController,private router:Router) {
  }

  ngOnInit() {
  }

async signmeup(){
  this.processingSignin=true;
    console.log('username:' ,this.username);
    console.log('password:' ,this.password);
    console.log('email:' ,this.email);

    const user = new Moralis.User();
    user.set('username', this.username);
    user.set('password', this.password);
    user.set('email', this.email);




    try {
      await user.signUp();
      this.processingSignin=false;
      this.username='';
      this.password='';
      this.email='';
      this.presentToast('Success: Try logging in now.');
      // Hooray! Let them use the app now.
    } catch (error) {
      this.processingSignin=false;
      // Show the error message somewhere and let the user try again.
      const msg = 'Error: ' + error.code + ' ' + error.message;
      console.log(msg);
      this.presentToast(msg);


    }


  }

  async  login() {
    let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.Web3.authenticate();
    }
    console.log('logged in user:', user);
}

async  logOut() {
    await Moralis.User.logOut();
    console.log('logged out');
}

isprocessing() {
  return !this.isprocessing;
}

async presentToast(msg) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 2000
  });
  toast.present();
}

gotologin(){
  this.router.navigateByUrl('/login');
}

}
