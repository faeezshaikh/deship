
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoralisService } from '../services/moralis.service';
declare let Moralis;

@Component({
  selector: 'app-listpackages',
  templateUrl: './listpackages.page.html',
  styleUrls: ['./listpackages.page.scss'],
})
export class ListpackagesPage implements OnInit {
  filterTerm: string;

  packageList: any[] = [];

  isLoading = false;

  constructor(private router : Router,private moralisService: MoralisService) {

    // this.retrieveList2();
    console.log(' Inside constructor');
   }

   ionViewWillEnter() {

     this.retrieveList2();
     console.log(' Inside ionViewWillEnter');


    }

    ngOnInit() {
      console.log(' Inside ngOnInit');
  }
  gotoaddpage() {
    this.router.navigateByUrl('/addpackage');
  }

  async retrieveList2(){
    this.isLoading = true;
    this.packageList = await this.moralisService.retrieveList();
    this.isLoading = false;
  }



  removeFromList(id) {

    const query = new Moralis.Query('Package');
    query.get(id).then((pkg) => {

      pkg.destroy().then((myObject) => {
        // The object was deleted from the Moralis Cloud.
        console.log('Packaged successfully deleted :' ,myObject);
      }, (error) => {
        console.log('Error deleting pkg:' ,error);
        // The delete failed.
        // error is a Moralis.Error with an error code and message.
      });

    }, (error) => {
      console.log('Error getting Package details:' ,error);
      // The object was not retrieved successfully.
      // error is a Moralis.Error with an error code and message.
    });
  }


  getItemFromList(id) {

    const query = new Moralis.Query('Package');
    query.get(id).then((pkg) => {
      // The object was retrieved successfully.
      // console.log('Package details:' ,pkg);
      console.log('Package details:' ,pkg.get('senderEmail'));
      console.log('Package details:' ,pkg.get('senderAddr'));
      console.log('Package details:' ,pkg.get('receiverAddr'));

    }, (error) => {
      console.log('Error getting Package details:' ,error);
      // The object was not retrieved successfully.
      // error is a Moralis.Error with an error code and message.
    });
  }
}
