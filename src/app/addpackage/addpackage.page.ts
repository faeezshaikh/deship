import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-addpackage',
  templateUrl: './addpackage.page.html',
  styleUrls: ['./addpackage.page.scss'],
})
export class AddpackagePage implements OnInit {

  gems = 1;
  days = 15;
  ionicForm: FormGroup;
  isSubmitted = false;

  delivery = false;
  fragile = false;

  constructor(private router: Router,public formBuilder: FormBuilder) { }

  ngOnInit() {

    this.ionicForm = this.formBuilder.group({
      address: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      range: ['', [Validators.min(1)]],
      instructions: ['', [Validators.nullValidator]],
      delivery: ['', [Validators.nullValidator]],
      fragile: ['', [Validators.nullValidator]]
    });
  }

  goback() {
    this.router.navigateByUrl('/listpackages');
  }

  rangeChanged(){
    if (this.gems > 18 && this.gems < 20)
        {this.days = 1;}

    if (this.gems > 15 && this.gems < 18)
        {this.days = 6;}
    if (this.gems > 12 && this.gems < 15)
        {this.days = 7;}
    if (this.gems > 8 && this.gems < 12)
       { this.days = 10;}
    if (this.gems > 5 && this.gems < 8)
        {this.days = 12;}
    if (this.gems > 0 && this.gems < 5)
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
      this.isSubmitted = false;
      this.ionicForm.reset();
      this.gems = 1;
      this.days = 15;
    }
  }

  // save2(){

  //   var packages = [{ id: 1, sender: 'John', senderAddr:'123 Pine St. St. Louis MO 63101',senderPhone: '555-1276',senderEmail: 'faeez.shaikh@gmail.com',  receiverAddr: '234 Brook St. Chesterfield MO 63103',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com',gems: 50, miles: 0.5, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5duF2C4wJfJfEoCTbe23miXSwN7De5wHwY5PtGs3KoP_aASn4Gg',fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!', status:'Ready' },
  //   { id: 2, sender: 'Mary', senderAddr:'123 Pine St. St. Louis MO 63101', senderPhone: '800-BIG-MARY',senderEmail: 'faeez.shaikh@gmail.com', receiverAddr: '3323 Weber Rd. Ballwin MO 63011',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com',gems: 30, miles: 1.3, img: 'http://www.saga.co.uk/contentlibrary/saga/publishing/verticals/money/spending/consumer-rights/parcel-scam-shutterstock-291281267.jpg',fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!', status:'Ready' },
  //   { id: 3, sender: 'Mike', senderAddr:'123 Pine St. St. Louis MO 63101',senderPhone: '555-4321', senderEmail: 'faeez.shaikh@gmail.com',receiverAddr: '5398 Brunswick Dr, Hazelwood MO 63245',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com',gems: 20, miles: 2.5, img: 'http://www.shipping-usa.co.uk/images/send-parcel-to-usa.png',fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!', status:'Ready' },
  //   { id: 4, sender: 'Adam', senderAddr:'123 Pine St. St. Louis MO 63101',senderPhone: '555-5678',senderEmail: 'faeez.shaikh@gmail.com', receiverAddr: '9445 Potter Rd. Des Plaines IL 94423',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com',gems: 90, miles: 2.8, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8JtPHRxj4dx5VjPEDxq3nIeJUjwCiiusazV9_ImTVXZNpOGz4tg',fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!', status:'In Transit' },
  //   { id: 5, sender: 'Julie', senderAddr:'123 Pine St. St. Louis MO 63101',senderPhone: '555-8765',senderEmail: 'faeez.shaikh@gmail.com',receiverAddr: '244 Pine St. St. Louis MO 63101',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com' ,gems: 70, miles: 3.0, img: 'https://www.directcouriersolutions.com/wp-content/uploads/2015/02/parcel-500-660-500x600.jpg',fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!' , status:'Ready'},
  //   { id: 6, sender: 'Juliette', senderAddr:'123 Pine St. St. Louis MO 63101',senderPhone: '555-5678', senderEmail: 'faeez.shaikh@gmail.com',receiverAddr: '8334 Golf Rd. Niles IL 9235',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com',gems: 60, miles: 3.5, img: 'http://www.book-cycle.org/wp-content/uploads/2015/08/parcel.png' ,fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!', status:'In Transit'},
  //   { id: 7, sender: 'John', senderAddr:'123 Pine St. St. Louis MO 63101',senderPhone: '555-1276',senderEmail: 'faeez.shaikh@gmail.com',receiverAddr: '982 Chestnut St. St. Louis MO 63103',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com' ,gems: 30, miles: 4.0, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5duF2C4wJfJfEoCTbe23miXSwN7De5wHwY5PtGs3KoP_aASn4Gg' ,fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!', status:'Ready'},
  //   { id: 8, sender: 'Mary', senderAddr:'123 Pine St. St. Louis MO 63101',senderPhone: '800-BIG-MARY', senderEmail: 'faeez.shaikh@gmail.com',receiverAddr: '243 Strecker Rd. Wildwood MO 63234',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com',gems: 200, miles: 4.5, img: 'http://www.saga.co.uk/contentlibrary/saga/publishing/verticals/money/spending/consumer-rights/parcel-scam-shutterstock-291281267.jpg',fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!' , status:'Ready'},
  //   { id: 9, sender: 'Mike', senderAddr:'123 Pine St. St. Louis MO 63101',senderPhone: '555-4321',senderEmail: 'faeez.shaikh@gmail.com',receiverAddr: '834 Wildhorse Ave. Ellisville MO 63143',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com' ,gems: 40, miles: 5.0, img: 'http://www.shipping-usa.co.uk/images/send-parcel-to-usa.png' ,fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!', status:'Ready'},
  //   { id: 10, sender: 'Adam', senderAddr:'123 Pine St. St. Louis MO 63101',senderPhone: '555-5678', senderEmail: 'faeez.shaikh@gmail.com',receiverAddr: '356 Park Ave. St. Louis MO 63134',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com',gems: 50, miles: 5.5, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8JtPHRxj4dx5VjPEDxq3nIeJUjwCiiusazV9_ImTVXZNpOGz4tg',fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!', status:'Ready' },
  //   { id: 11, sender: 'Julie', senderAddr:'123 Pine St. St. Louis MO 63101',senderPhone: '555-8765',senderEmail: 'faeez.shaikh@gmail.com',receiverAddr: '234 Executive Dr. Collinsville MO 63124',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com' ,gems: 60, miles: 5.8, img: 'https://www.directcouriersolutions.com/wp-content/uploads/2015/02/parcel-500-660-500x600.jpg',fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!', status:'Ready' },
  //   { id: 12, sender: 'Juliette',senderAddr:'123 Pine St. St. Louis MO 63101', senderPhone: '555-5678', senderEmail: 'faeez.shaikh@gmail.com',receiverAddr: '74 Bridge Rd. Bridgeton MO 63123 ',recieverPhone: '205-345-9545',recieverEmail: 'john@gmail.com',gems: 80, miles: 6.0, img: 'http://www.book-cycle.org/wp-content/uploads/2015/08/parcel.png',fragile:false,confirm:false,instructions:'Please drop the package at the doorstep. Do not ring doorbell. Thanks!', status:'Ready' }];


  //   for(let i=0;i<=packages.length;i++) {
  //     const Package = Moralis.Object.extend('Package');
  //     const pkg = new Package();
  //     pkg.set('id', packages[i].id);
  //     pkg.set('sender', packages[i].sender);
  //     pkg.set('senderAddr', packages[i].senderAddr);
  //     pkg.set('senderPhone', packages[i].senderPhone);
  //     pkg.set('senderEmail', packages[i].senderEmail);
  //     pkg.set('receiverAddr', packages[i].receiverAddr);
  //     pkg.set('recieverPhone', packages[i].recieverPhone);
  //     pkg.set('gems', packages[i].gems);
  //     pkg.set('miles', packages[i].gems);
  //     pkg.set('img', packages[i].img);
  //     pkg.set('fragile', packages[i].fragile);
  //     pkg.set('instructions', packages[i].instructions);
  //     pkg.set('confirm', packages[i].confirm);
  //     pkg.set('status', packages[i].status);


  //     pkg.save().then((savedObject) => {
  //       // Execute any logic that should take place after the object is saved.
  //       console.log('New object created with objectId: ' + savedObject.id);

  //     }, (error) => {
  //       // Execute any logic that should take place if the save fails.
  //       // error is a Moralis.Error with an error code and message.
  //       console.log('Failed to create new object, with error code: ' + error.message);
  //     });
  //   }

  // }

}
