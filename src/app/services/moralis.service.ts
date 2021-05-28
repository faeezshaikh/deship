import { Injectable } from '@angular/core';
declare Moralis;

@Injectable({
  providedIn: 'root'
})
export class MoralisService {

  constructor() {

    Moralis.initialize("YOUR_APP_ID");

    Moralis.serverURL = 'https://YOUR_MORALIS_SERVER:1337/server'
  }
}
