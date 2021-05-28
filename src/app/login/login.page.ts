import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router:Router,private menu: MenuController) {}


  ngOnInit() {
  }

  login() {
    localStorage.setItem('authenticated','yes');
    this.menu.enable(true);
    this.router.navigateByUrl('/folder/Inbox');

  }
}
