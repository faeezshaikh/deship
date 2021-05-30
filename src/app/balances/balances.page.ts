import { getLocaleFirstDayOfWeek } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MoralisService } from '../services/moralis.service';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.page.html',
  styleUrls: ['./balances.page.scss'],
})
export class BalancesPage implements OnInit {

  bnbBalances: any[];
  maticBalances: any[];
  ethBalances: any[];
  gettingBalances = false;
  constructor(private moralisService : MoralisService) { }

  ngOnInit() {
    this.getBalances();
  }

  async getBalances() {
    this.gettingBalances = true;
    const resp = await this.moralisService.getBalances();
    console.log(resp);
    this.bnbBalances = resp.bnbBalances;
    this.maticBalances = resp.maticBalances;
    this.ethBalances = resp.ethBalances;
    console.log(this.bnbBalances);
    console.log(this.maticBalances);
    console.log(this.ethBalances);
    this.gettingBalances = false;

  }

  format(val) {
    return this.moralisService.format(val);
  }

}
