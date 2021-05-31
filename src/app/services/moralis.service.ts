import { Injectable, resolveForwardRef } from '@angular/core';

declare let Moralis;

@Injectable({
  providedIn: 'root'
})
export class MoralisService {

  packageList: any[] = [];
  public ethAddress:any = 'none';
  public ethAddressDisplay:any = 'none';

  constructor() { }


   async retrieveList() {

    const query = new Moralis.Query('Package');


    const results = await query.find();

    console.log('Successfully retrieved ' + results.length + ' packages.');
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    this.packageList = [];
    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      // console.log(object.id + ' - Sender: ' + object.get('sender') + ' Receiver: ' + object.get('receiverAddr'));
      this.packageList.push(
        {id:object.id,sender:object.get('sender'),senderAddr:object.get('senderAddr'),
         senderPhone:object.get('senderPhone'),senderEmail:object.get('senderEmail'),
         receiverAddr:object.get('receiverAddr'),receiverPhone:object.get('receiverPhone'),
         receiverEmail:object.get('receiverEmail'),gems:object.get('gems'),miles:object.get('miles'),
         img:object.get('img'),fragile:object.get('fragile'),confirm:object.get('confirm'),
         instructions:object.get('instructions'),status:object.get('status')});
    }

    return this.packageList;
  }

  async getImg(url){
    return await Moralis.Cloud.httpRequest({ url: 'https://ipfs.moralis.io:2053/ipfs/QmRW6VaaMQ3bK7W2QDRLqj1ivP7knHejPf72r2fQVVxXKP' });
  }

  addToList(sender,senderAddr,senderPhone,senderEmail,receiverAddr,receiverPhone,receiverEmail,gems,miles,img,fragile
    ,instructions,delivery,status) {
    const Package = Moralis.Object.extend('Package');
    const pkg = new Package();
    pkg.set('sender', sender);
    pkg.set('senderAddr', senderAddr);
    pkg.set('senderPhone', senderPhone);
    pkg.set('senderEmail', senderEmail);
    pkg.set('receiverAddr', receiverAddr);
    pkg.set('recieverPhone', receiverPhone);
    pkg.set('gems', gems);
    pkg.set('miles', miles);
    pkg.set('img', img);
    pkg.set('fragile', fragile);
    pkg.set('instructions', instructions);
    pkg.set('confirm', delivery);
    pkg.set('status', status);


    pkg.save().then((savedObject) => {
      console.log('Successfully added :',savedObject);
    }, (error) => {
      console.log('Error retrieve:',error);
    });


  }


  async saveImage(webviewPath,filename,base64Data) {
    // const image = "data:image/png;base64,iVBORw0KGgoAAA...."
    const image = webviewPath;
    const file = new Moralis.File(filename, { base64: base64Data });
    const savedIpfs = await file.saveIPFS();
    // console.log('IPFS name and hash',file.ipfs() + ' ' + file.hash());

    const moralisUpload = await file.save();
    // console.log('moralis upload', file.url());

    return {'ipfs':file.ipfs(), 'hash':file.hash(),'moralisurl':file.url()};



  }

  async getItemFromList(id) {

    const query = new Moralis.Query('Package');
    const resp = await query.get(id);
    return {    senderEmail: resp.get('senderEmail'),
                senderAddr : resp.get('senderAddr'),
                receiverAddr : resp.get('receiverAddr'),
                delivery : resp.get('confirm'),
                img: resp.get('img'),
                gems: resp.get('gems'),
              instructions: resp.get('instructions'),
              fragile:resp.get('fragile'),
              status: resp.get('status'),
              sender: resp.get('sender'),
              receiverPhone: resp.get('receiverPhone'),
              senderPhone: resp.get('senderPhone'),
              miles: resp.get('miles')
            };
    // query.get(id).then((pkg) => {

    //   console.log('Package details:' ,pkg.get('senderEmail'));
    //   console.log('Package details:' ,pkg.get('senderAddr'));
    //   console.log('Package details:' ,pkg.get('receiverAddr'));

    // }, (error) => {
    //   console.log('Error getting Package details:' ,error);

    // });
  }

  async walletConnect2(){
    const add = await Moralis.Web3.authenticate();
    const tmpAdd = add.get('ethAddress');
    console.log('address: ',tmpAdd);
    const last5 =  tmpAdd.substr(tmpAdd.length - 5);
    const first5 =  tmpAdd.substring(0,4);
    console.log(first5+'...'+last5);
    this.ethAddressDisplay = first5+'...'+last5;
    this.ethAddress = add.get('ethAddress');
    localStorage.setItem('ethAddr', this.ethAddress);
    localStorage.setItem('ethAddrDisp', this.ethAddressDisplay);
    return {ethAdd:this.ethAddress,ethAddDisp:this.ethAddressDisplay};
  }

  async getBalances() {

    const ethAddress = localStorage.getItem('ethAddr');
    if(ethAddress) {

      const maticBalances = await Moralis.Web3.getAllERC20( { chain: 'mumbai', address: ethAddress});
      console.log('Balances for Matic Network: ',maticBalances);
      // balances is array of objs. Each obj is:
      // balance: "2475683695000000000"
      // decimals: 18
      // name: "Binance Coin"
      // symbol: "BNB"

      const bnbBalances = await Moralis.Web3.getAllERC20( { chain: 'binance', address: ethAddress});
      console.log('Balances for Binance Network: ',bnbBalances);

      const ethBalances = await Moralis.Web3.getAllERC20( { chain: 'eth', address: ethAddress});
      console.log('Balances for Binance Network: ',ethBalances);

      const options2 = { chain: 'binance', address: ethAddress, order: 'desc' };
      console.log(options2);
       const transactions = await Moralis.Web3.getTransactions(options2);
       console.log(transactions);

       return {bnbBalances,maticBalances,ethBalances};
     } else {
       console.log('Connect to Wallet first.');

     }
    }

    format(amountInWei) {
      const web3 = new Moralis.Web3();
      const amountInEth = web3.utils.fromWei(amountInWei, 'ether');
      return amountInEth;
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
