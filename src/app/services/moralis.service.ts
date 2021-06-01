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
    ,instructions,delivery,status,creator) {
    const Package = Moralis.Object.extend('Package');

    const pkg = new Package();
    pkg.set('sender', sender);
    pkg.set('senderAddr', senderAddr);
    pkg.set('senderPhone', senderPhone);
    pkg.set('senderEmail', senderEmail);
    pkg.set('receiverEmail', receiverEmail);
    pkg.set('receiverAddr', receiverAddr);
    pkg.set('recieverPhone', receiverPhone);
    pkg.set('gems', gems);
    pkg.set('miles', miles);
    pkg.set('img', img);
    pkg.set('fragile', fragile);
    pkg.set('instructions', instructions);
    pkg.set('confirm', delivery);
    pkg.set('status', status);
    pkg.set('creator', creator);


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

  async getCurrentUser() {
    const user = await Moralis.User.current();
    console.log(user.id);

    const query = new Moralis.Query('User');
    const resp = await query.get(user.id);
    // const results = await user.find();
    console.log(resp.get('username'));
    console.log(resp.get('email'));
    return {'username':resp.get('username'),'email':resp.get('email')};

  }

   async updateItem(img,email) {
    const query = new Moralis.Query('Package');
    // console.log(id);

    query.equalTo('img', img);
    const results = await query.find();

    const pkg = results[0];


    pkg.set('status', 'In Transit');
    pkg.set('mover',email);

    pkg.save().then((resp) => {
      console.log('Update successful');

      });
  }


  async getItemFromList(id) {

    const query = new Moralis.Query('Package');
    const resp = await query.get(id);
    return {    senderEmail: resp.get('senderEmail'),
                senderAddr : resp.get('senderAddr'),
                receiverAddr : resp.get('receiverAddr'),
                receiverEmail : resp.get('receiverEmail'),
                delivery : resp.get('confirm'),
                img: resp.get('img'),
                gems: resp.get('gems'),
              instructions: resp.get('instructions'),
              fragile:resp.get('fragile'),
              status: resp.get('status'),
              sender: resp.get('sender'),
              receiverPhone: resp.get('recieverPhone'),
              senderPhone: resp.get('senderPhone'),
              miles: resp.get('miles'),
              creator: resp.get('creator')
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

}
