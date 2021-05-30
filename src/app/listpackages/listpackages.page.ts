
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router : Router) {

    this.retrieveList();
   }

  ngOnInit() {
  }
  gotoaddpage() {
    this.router.navigateByUrl('/addpackage');
  }


  async retrieveList() {

    this.isLoading = true;
    const query = new Moralis.Query('Package');


    const results = await query.find();
    this.isLoading = false;
    console.log('Successfully retrieved ' + results.length + ' packages.');

    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      console.log(object.id + ' - Sender: ' + object.get('sender') + ' Receiver: ' + object.get('receiverAddr'));
      this.packageList.push(

        {'id':object.id,'sender':object.get('sender'),'senderAddr':object.get('senderAddr'),
        'senderPhone':object.get('senderPhone'),'senderEmail':object.get('senderEmail'),
      'receiverAddr':object.get('receiverAddr'),'receiverPhone':object.get('receiverPhone'),
    'receiverEmail':object.get('receiverEmail'),'gems':object.get('gems'),'miles':object.get('miles'),
  'img':object.get('img'),'fragile':object.get('fragile'),'confirm':object.get('confirm'),
'instructions':object.get('instructions'),'status':object.get('status')}
);
    }

    console.log('Array:',this.packageList);


  }

  addToList() {
    const Package = Moralis.Object.extend('Package');
    const pkg = new Package();
    pkg.set('sender', 'fsh');
    pkg.set('senderAddr', '1093 creek rd');
    pkg.set('senderPhone', '374-434-3355');
    pkg.set('senderEmail', 'fsh@gmail.com');
    pkg.set('receiverAddr', '345 oak st.');
    pkg.set('recieverPhone', '345-335-9734');
    pkg.set('gems', 40);
    pkg.set('miles', 8);
    pkg.set('img', 'http://www.book-cycle.org/wp-content/uploads/2015/08/parcel.png');
    pkg.set('fragile', false);
    pkg.set('instructions', 'Drop at door');
    pkg.set('confirm', false);
    pkg.set('status', 'Open');


    pkg.save().then((savedObject) => {
      console.log('Successfully added :',savedObject);
    }, (error) => {
      console.log('Error retrieve:',error);
    });
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
