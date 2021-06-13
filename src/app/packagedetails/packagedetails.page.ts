import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { EventsService } from '../services/events.service';
import { MoralisService } from '../services/moralis.service';

@Component({
  selector: 'app-packagedetails',
  templateUrl: './packagedetails.page.html',
  styleUrls: ['./packagedetails.page.scss'],
})
export class PackagedetailsPage implements OnInit {
  pkgdetails:any = {};
  img:any;
  email:any;

  constructor(private activatedRoute: ActivatedRoute,private router: Router,
    private moralisService : MoralisService, private alertController: AlertController,
    private toastController : ToastController,private events: EventsService,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    const objId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(objId);
    const that = this;
    this.getDetails(objId).then(function (resp) {
      that.pkgdetails = resp;
      console.log(that.pkgdetails);

    });

    this.getCurrentUser();
  }

  ionViewWillEnter() {
    this.init();

  }


  getListingUrl(txnHash) {
    let url = 'https://explorer-mumbai.maticvigil.com/tx/' + txnHash + '/logs';
    return url;
  }
  async getCurrentUser() {
    this.email = localStorage.getItem('emailId');
    console.log(this.email);

  }


  goback() {
    this.router.navigateByUrl('/listpackages');
  }

  async getDetails(objId) {
     return await this.moralisService.getItemFromList(objId);
  }

  notifySender(senderEmail, moverEmail) {
    this.moralisService.sendDropoffEmail(senderEmail,moverEmail);
    this.presentToast('Email was successfully sent to the sender');

  }
  async pickup(img,packageId,payout,creator,mover) {
    console.log('Mover is :',mover);
    
    const loader = await this.presentLoading();
    loader.present();

    const resp = await this.moralisService.pickPackage(packageId,payout/2).then(res => {

      console.log('Success', res);
      const events = res.events.NewShipping;
      console.log(events);
      loader.dismiss();

      this.moralisService.updateItem(img,this.email,'In Transit',res.transactionHash);

      this.foo();
      this.moralisService.sendPickupEmail(creator,mover);

    }).catch(err => {
      console.log(err);
          loader.dismiss();
          this.presentToast('Error. Check your chain. Please log in to Metamask again and connect to Matic chain.');

    });
}
  async confirmdelivery(img,packageId,mover) {

    const loader = await this.presentLoading();
    loader.present();

    const resp = await this.moralisService.confirmDelivery(packageId).then(res => {

      console.log('Success', res);

      console.log(res);
      loader.dismiss();

      this.moralisService.updateItem(img,this.email,'Delivered',res.transactionHash);
      this.foo();
      this.moralisService.sendDeliveryConfirmEmail(mover);

    }).catch(err => {
      console.log(err);
          loader.dismiss();
          this.presentToast('Error. Check your chain. Please log in to Metamask again and connect to Matic chain.');

    });




  }



  foo() {
    this.events.publishSomeData({
      refresh:'true',
      username: localStorage.getItem('username'),
      email: this.email})
      ;

    this.router.navigateByUrl('/listpackages');
    this.presentToast('Order updated successfully.');
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2500
    });
    toast.present();
  }


  async presentAlertConfirm(obj,state) {
    console.log(obj);
    console.log('Mover:',this.email);
    let msg ;
    if(state === 'pickup') {
        msg = 'You will need to stake ' + obj.gems/2 + ' MATIC. Are you sure you want to pick this package?';
    } else if (state === 'confirm') {
        msg = 'Are you sure you want to confirm delivery of this package?';
    } else if (state === 'notify') {
      msg = 'This will send an email to notify the sender that the package has been delivered. Do you want to continue?';
  }

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
            if(state === 'pickup') {
              this.pickup(obj.img,obj.packageId,obj.gems,obj.creator,this.email);
            } else if(state === 'confirm') {
              this.confirmdelivery(obj.img,obj.packageId,obj.mover);
            } else if (state === 'notify') {
             this.notifySender(obj.creator,obj.mover);
          }

          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait. Mining transaction on Matic. '
    });
  }

  getProgressBarValue(pkgdetails){
    if(pkgdetails.status === 'In Transit') {
      return '0.5';
    }
    if(pkgdetails.status === 'Delivered') {
      return '1';
    }
    if(pkgdetails.status === 'Ready') {
      return '0.2';
    }

  }

  getProgressBarText(pkgdetails){
    if(pkgdetails.status === 'In Transit') {
      return 'In Transit';
    }
    if(pkgdetails.status === 'Delivered') {
      return 'Delivered';
    }
    if(pkgdetails.status === 'Ready') {
      return 'Ready for pickup';
    }
  }

}
