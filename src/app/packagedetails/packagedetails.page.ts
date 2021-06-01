import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
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
    private toastController : ToastController,private events: EventsService) { }

  ngOnInit() {
    const objId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(objId);
    const that = this;
    this.getDetails(objId).then(function(resp) {
      that.pkgdetails = resp;
      console.log(that.pkgdetails);

     });

     this.getCurrentUser();
  }

  ionViewWillEnter() {
    this.getCurrentUser();
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

  pickup(img) {
    this.moralisService.updateItem(img,this.email,'In Transit');
    this.foo();
  }
  confirmdelivery(img) {
    this.moralisService.updateItem(img,this.email,'Delivered');
    this.foo();
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
      duration: 2000
    });
    toast.present();
  }


  async presentAlertConfirm(obj,state) {
    console.log(obj);

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm.',
      message: 'Are you sure you want to pick this package?',
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
              this.pickup(obj.img);
            } else if(state === 'confirm') {
              this.confirmdelivery(obj.img);
            }

          }
        }
      ]
    });

    await alert.present();
  }



}
