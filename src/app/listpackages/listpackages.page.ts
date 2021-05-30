
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MoralisService } from '../services/moralis.service';
declare let Moralis;

@Component({
  selector: 'app-listpackages',
  templateUrl: './listpackages.page.html',
  styleUrls: ['./listpackages.page.scss'],
})
export class ListpackagesPage implements OnInit {
  filterTerm: string;

  ethAddress:any = 'none';
  ethAddressDisplay:any = 'none';

  packageList: any[] = [];

  isLoading = false;

  constructor(private router : Router,private moralisService: MoralisService,
    private alertController: AlertController) {

    // this.retrieveList2();
    console.log(' Inside constructor');
   }

   ionViewWillEnter() {

     this.retrieveList2();
     console.log(' Inside ionViewWillEnter');


     const ethAddress = localStorage.getItem('ethAddr');
     if(ethAddress) {
       this.ethAddress = ethAddress;
     }

     const ethAddressDisp = localStorage.getItem('ethAddrDisp');
     if(ethAddressDisp) {
       this.ethAddressDisplay = ethAddressDisp;
     }



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


  async walletConnect() {
    const resp = await this.moralisService.walletConnect2();
    // const obj = resp.then(function(response) {
    //  return  console.log(response);
    // });
    console.log('Obj:',resp);
    this.ethAddress = resp.ethAdd;
    this.ethAddressDisplay = resp.ethAddDisp;


  }

  walletDisconnect(){
    this.presentAlertConfirm('Are you sure you want to disconnect your wallet?');
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

  async presentAlertConfirm(msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm.',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {

            localStorage.removeItem('ethAddr');
            localStorage.removeItem('ethAddrDisp');
            this.ethAddress = 'none';
          }
        }
      ]
    });

    await alert.present();
  }
}
