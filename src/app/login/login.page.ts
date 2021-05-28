import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

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
  constructor(private router:Router,private menu: MenuController) {}


  ngOnInit() {
  }



  gotosignup(){
    this.router.navigateByUrl('/signup');
  }


  async  login() {

    let user = new Moralis.User();
    user.set('username', this.username);
    user.set('password', this.password);



    user = Moralis.User.current();
    if (!user) {
      user = await Moralis.Web3.authenticate();
    }
    console.log('logged in user:', user);
    localStorage.setItem('authenticated','yes');
    this.menu.enable(true);
    this.router.navigateByUrl('/folder/Inbox');
}

}
