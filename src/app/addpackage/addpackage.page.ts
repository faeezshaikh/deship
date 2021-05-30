import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addpackage',
  templateUrl: './addpackage.page.html',
  styleUrls: ['./addpackage.page.scss'],
})
export class AddpackagePage implements OnInit {

  gems = 0;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  goback() {
    this.router.navigateByUrl('/listpackages');
  }

}
