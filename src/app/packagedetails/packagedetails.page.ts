import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-packagedetails',
  templateUrl: './packagedetails.page.html',
  styleUrls: ['./packagedetails.page.scss'],
})
export class PackagedetailsPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));

  }

  goback() {
    this.router.navigateByUrl('/listpackages');
  }

}
