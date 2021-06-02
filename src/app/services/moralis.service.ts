import { Injectable, resolveForwardRef } from '@angular/core';

declare let Moralis;

@Injectable({
  providedIn: 'root'
})
export class MoralisService {

  packageList: any[] = [];
  abi:any;
  public ethAddress:any = 'none';
  public ethAddressDisplay:any = 'none';

  constructor() {

    this.abi = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_pkgId",
            "type": "uint256"
          }
        ],
        "name": "confirmDelivery",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "listPackage",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "packageId",
            "type": "uint256"
          }
        ],
        "name": "NewDelivery",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "packageId",
            "type": "uint256"
          }
        ],
        "name": "NewPackage",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "packageId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "shipper",
            "type": "address"
          }
        ],
        "name": "NewShipping",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_pkgId",
            "type": "uint256"
          }
        ],
        "name": "pickPackage",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMyBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "packageId",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "packages",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "payout",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "shipperCollateral",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "shipper",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "status",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];


  }


   async retrieveList() {

    const query = new Moralis.Query('Package');


    const results = await query.find();

    console.log('Successfully retrieved ' + results.length + ' packages.');
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    this.packageList = [];
    for (let i = 0; i < results.length; i++) {
      const object = results[i];

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
    ,instructions,delivery,status,creator,txnHash) {
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
    pkg.set('txnHash', txnHash);


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
    console.log('Moralis current user:',user.id);

    const query = new Moralis.Query('User');
    const resp = await query.get(user.id);
    // const results = await user.find();
    console.log('Username:',resp.get('username'));
    console.log('Email:',resp.get('email'));
    return {'username':resp.get('username'),'email':resp.get('email')};

  }

   async updateItem(img,email,state) {
    const query = new Moralis.Query('Package');
    // console.log(id);

    query.equalTo('img', img);
    const results = await query.find();

    const pkg = results[0];

    if(state === 'In Transit') {

      pkg.set('status', 'In Transit');
      pkg.set('mover',email);
    } else if(state === 'Delivered') {
      pkg.set('status', 'Delivered');
    }

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


  async listPackage(value){
    const web3 = await Moralis.Web3.enable();
    var contract = new web3.eth.Contract(this.abi, '0x7e38C04f0659f93793111886F731CD2D863eB79a');

    console.log('Eth addr:',localStorage.getItem('ethAddr'));

    // call constant function (synchronous way)
    // var msg = contract.methods.message().call().then(function(resp){
    //   console.log('msg='+resp);
    //   return resp;
    // });

    // contract.methods.listPackage().send();
    // contract.listPackage({from: localStorage.getItem('ethAddr'), gas: 3000000, value: value}, function(err, res){});

    // contract.listPackage({from: localStorage.getItem('ethAddr'), gas: 3000000, value: value}, function(err, res){});

    const fundit = await  contract.methods.listPackage().send({
            from: localStorage.getItem('ethAddr') ,
            value: value
          });
    console.log(fundit);

        return fundit;



  }


}
