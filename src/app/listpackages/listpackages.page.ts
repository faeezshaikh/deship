
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController ,IonSlides,PopoverController } from '@ionic/angular';
import { BalancesPage } from '../balances/balances.page';
import { MoralisService } from '../services/moralis.service';
import { ViewChild } from '@angular/core';



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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('mySlider', { static: true }) slides: IonSlides;
  packageList: any[] = [];

  isLoading = false;

  constructor(private router : Router,private moralisService: MoralisService,
    private alertController: AlertController,public popoverController: PopoverController) {

    // this.retrieveList2();
    console.log(' Inside constructor');
   }

   slideOpts = {
    initialSlide: 0,
    speed: 1000
  };

  swipeNext(){
    console.log('next');

    this.slides.slideNext();
  }

  swipePrev() {
    console.log('prev');
    this.slides.slidePrev();

  }


   ionViewWillEnter() {

     this.retrieveList2();
     console.log(' Inside ionViewWillEnter');


     this.getWalletStatus();



    }

  private getWalletStatus() {
    const ethAddress = localStorage.getItem('ethAddr');
    if (ethAddress) {
      this.ethAddress = ethAddress;
    } else {
      this.ethAddress = 'none';
    }

    const ethAddressDisp = localStorage.getItem('ethAddrDisp');
    if (ethAddressDisp) {
      this.ethAddressDisplay = ethAddressDisp;
    } else {
      this.ethAddressDisplay = 'none';
    }
  }

    ngOnInit() {
      console.log(' Inside ngOnInit');
      this.getWalletStatus();
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

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: BalancesPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
