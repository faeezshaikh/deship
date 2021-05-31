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

     this.img = this.getImg();
     console.log('Image: ',this.img);



  }

  async getImg() {
    return await this.moralisService.getImg('url');
  }

  goback() {
    this.router.navigateByUrl('/listpackages');
  }

  async getDetails(objId) {
     return await this.moralisService.getItemFromList(objId);
  }

}
