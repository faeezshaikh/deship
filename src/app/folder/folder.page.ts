import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { MenuController } from '@ionic/angular';
declare let Moralis;
@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  ethAddress:any = 'none';
  ethAddressDisplay:any = 'none';
  abi:any;

  constructor(private activatedRoute: ActivatedRoute,
    private menu: MenuController,
    private router:Router) {


      this.abi = [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "initMessage",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "string",
              "name": "newMessage",
              "type": "string"
            }
          ],
          "name": "update",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "message",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ];







    }


  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }



  logout() {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('ethAddr');
    this.menu.enable(false);
    this.router.navigateByUrl('/');

  }




  async getBalances() {

  const ethAddress = localStorage.getItem('ethAddr');
  if(ethAddress) {
    const options = { chain: 'binance', address: ethAddress};
    console.log(options);

    const balances = await Moralis.Web3.getAllERC20(options);
    console.log(balances);

    const options2 = { chain: 'binance', address: ethAddress, order: 'desc' };
    console.log(options2);
     const transactions = await Moralis.Web3.getTransactions(options2);
     console.log(transactions);
   } else {
     console.log('Connect to Wallet first.');

   }
  }

  async connectoContract(){


    const web3 = await Moralis.Web3.enable();
    var contract = new web3.eth.Contract(this.abi, '0x65a11dE5F240D1Fe5997721301EF423700131e60');

// call constant function (synchronous way)
var msg = contract.methods.message().call().then(function(resp){
  console.log('msg='+resp);
  return resp;
});

console.log('Resp: ',msg);


    console.log('Default block:',contract.defaultBlock);




  }

  async sendTxn(){
    // using the callback

    const web3 = await Moralis.Web3.enable();
    var contract = new web3.eth.Contract(this.abi, '0x65a11dE5F240D1Fe5997721301EF423700131e60');
contract.methods.update('Allahahfiz').send({from: this.ethAddress}, function(error, transactionHash){
    console.log('Done',transactionHash);

});
  }
}
