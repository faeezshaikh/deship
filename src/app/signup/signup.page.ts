
import { Component, OnInit } from '@angular/core';
declare function signup(username,pass,email): void;
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

  constructor() {
  }

  ngOnInit() {
  }

async signmeup(){
    console.log('username:' ,this.username);
    console.log('password:' ,this.password);
    console.log('email:' ,this.email);

    const user = new Moralis.User();
    user.set('username', this.username);
    user.set('password', this.password);
    user.set('email', this.email);




    try {
      await user.signUp();
      // Hooray! Let them use the app now.
    } catch (error) {
      // Show the error message somewhere and let the user try again.
      console.log('Error: ' + error.code + ' ' + error.message);

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


}
