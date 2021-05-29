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
  ethAddress:any;

  constructor(private activatedRoute: ActivatedRoute,
    private menu: MenuController,
    private router:Router) { }


  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }



  logout() {
    localStorage.removeItem('authenticated');
    this.menu.enable(false);
    this.router.navigateByUrl('/');

  }

walletConnect(){
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    const add = Moralis.Web3.authenticate().then(function (user) {
      console.log(user.get('ethAddress'));
      return user.get('ethAddress');
      // this.ethAddress = user.get('ethAddress');
      // this.foo(user.get('ethAddress'));
  });
  this.ethAddress = add;
  console.log(add);

  }

  async getBalances() {
   // const options = { chain: 'binance', address: '0x200d7743052b920a80c85686ab0dd3e104fba7e8'};
   /// console.log(options);

    // const balances = await Moralis.Web3.getAllERC20(options);
    // console.log(balances);

  //  const options2 = { chain: 'bsc', address: '0x200d7743052b920a80c85686ab0dd3e104fba7e8', order: 'desc' };
    const transactions = await Moralis.Web3.getTransactions();
    console.log(transactions);
  }
}
