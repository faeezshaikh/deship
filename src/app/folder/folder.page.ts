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

  constructor(private activatedRoute: ActivatedRoute,
    private menu: MenuController,
    private router:Router) { }


  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }



  logout() {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('ethAddr');
    this.menu.enable(false);
    this.router.navigateByUrl('/');

  }


async walletConnect2(){

  const add = await Moralis.Web3.authenticate();
  // this.ethAddress = add.get('ethAddress');
  console.log('address: ',this.ethAddress);
  localStorage.setItem('ethAddr', this.ethAddress);
  const tmpAdd = add.get('ethAddress');
  const last5 =  tmpAdd.substr(tmpAdd.length - 5);
  const first5 =  tmpAdd.substring(0,4);
  console.log(first5+'...'+last5);
  this.ethAddress = first5+'...'+last5;




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

}
