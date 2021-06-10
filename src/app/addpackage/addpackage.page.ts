import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MoralisService } from '../services/moralis.service';
import { UtilService } from '../services/util.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { PhotoService } from '../services/photo.service';


@Component({
  selector: 'app-addpackage',
  templateUrl: './addpackage.page.html',
  styleUrls: ['./addpackage.page.scss'],
})
export class AddpackagePage implements OnInit {

  gems = 100;
  days = 15;
  ionicForm: FormGroup;
  isSubmitted = false;
  email:any;
  loading;

  isMining = false;

  delivery = false;
  fragile = false;

  constructor(private router: Router,public formBuilder: FormBuilder,
          private utilService: UtilService,
          private moralisService:MoralisService,
          public alertController: AlertController,
          public photoService: PhotoService,
          private toastController: ToastController,
          public loadingController: LoadingController) { }

  ngOnInit() {

    this.ionicForm = this.formBuilder.group({




      address: ['', [Validators.required, Validators.minLength(5)]],
      pickupaddress: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],

      range: ['', [Validators.min(1)]],
      instructions: ['', [Validators.nullValidator]],
      delivery: ['', [Validators.nullValidator]],
      fragile: ['', [Validators.nullValidator]]
    });

    console.log('User: ',this.moralisService.getCurrentUser());

      this.getCurrentUser();
  }

  goback() {
    this.router.navigateByUrl('/listpackages');
  }

  rangeChanged(){
    if (this.gems > 800 && this.gems < 900)
        {this.days = 1;}

    if (this.gems > 600 && this.gems < 800)
        {this.days = 6;}
    if (this.gems > 400 && this.gems < 600)
        {this.days = 7;}
    if (this.gems > 300 && this.gems < 400)
       { this.days = 10;}
    if (this.gems > 100 && this.gems < 300)
        {this.days = 12;}
    if (this.gems > 0 && this.gems < 100)
        {this.days = 15;}

  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  submitForm() {
    console.log('Submitted');

    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!');

      console.log();

      return false;
    } else {
      console.log(this.ionicForm.value);
      const cost = this.ionicForm.value.range / 1000;
      this.presentAlertConfirm('This will cost you ' + cost + ' MATIC. Are you sure you want to continue?');

    }


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
            console.log('Confirm Okay');
            this.addConfirmed();
          }
        }
      ]
    });

    await alert.present();
  }

  async addConfirmed(){
    this.isSubmitted = false;

    // this.gems = 1;
    // this.days = 15;
    this.isMining = true;
    const loader = await this.presentLoading();
    loader.present();


    const resp = await this.moralisService.listPackage(this.ionicForm.value.range/1000).then(res => {


      console.log('Success', res);
      const events = res.events.NewPackage;
      console.log(events);
      console.log(events.returnValues.packageId);

      let photo:any = '';
      if(this.photoService.photos) {
        photo = this.photoService.photos[0].ipfs;
      }
      loader.dismiss();
      this.moralisService.addToList('John Doe',this.ionicForm.value.pickupaddress,'345-345-34535',this.ionicForm.value.senderemail,
      this.ionicForm.value.address,this.ionicForm.value.mobile,
        this.ionicForm.value.email,this.ionicForm.value.range/1000,304,photo,
        this.ionicForm.value.fragile,this.ionicForm.value.instructions,
        this.ionicForm.value.delivery,'Ready',this.email,res.transactionHash,events.returnValues.packageId
        );
      this.utilService.presentToast('Package has been successfully added.');
      this.ionicForm.reset();
      this.goback();
    }).catch(err => {
      console.log(err);
          loader.dismiss();
          this.presentToast('Error. Check your chain. Please log in to Metamask again and connect to Matic chain.');

    });

  }



  getCurrentUser() {
    this.email = localStorage.getItem('emailId');
    console.log(this.email);
  }

  takePhoto() {
    this.photoService.addNewToGallery();
  }


async presentToast(msg) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 2000
  });
  toast.present();
}

async presentLoading() {
  return await this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Please wait. Mining transaction on Matic. '
  });
}
}
