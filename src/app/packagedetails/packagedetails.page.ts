import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoralisService } from '../services/moralis.service';

@Component({
  selector: 'app-packagedetails',
  templateUrl: './packagedetails.page.html',
  styleUrls: ['./packagedetails.page.scss'],
})
export class PackagedetailsPage implements OnInit {
  pkgdetails:any = {};
  img:any;

  constructor(private activatedRoute: ActivatedRoute,private router: Router,
    private moralisService : MoralisService) { }

  ngOnInit() {
    const objId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(objId);
    const that = this;
    this.getDetails(objId).then(function(resp) {
      that.pkgdetails = resp;
     });





  }


  goback() {
    this.router.navigateByUrl('/listpackages');
  }

  async getDetails(objId) {
     return await this.moralisService.getItemFromList(objId);
  }

}
