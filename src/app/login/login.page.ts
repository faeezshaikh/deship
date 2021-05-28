import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router:Router) {}


  ngOnInit() {

    console.log('auth value:', localStorage.getItem('authenticated)'));

    if(localStorage.getItem('authenticated)') === 'yes') {
      console.log("User is authenticated");
      this.router.navigateByUrl('/folder/Inbox');

      return true;
    } else {
      console.log("User is not authenticated");
      this.router.navigateByUrl('/');
      return false;
    }

  }

  login() {
    localStorage.setItem('authenticated','yes');
    this.router.navigateByUrl('/folder/Inbox');

  }
}
