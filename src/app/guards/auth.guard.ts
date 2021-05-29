import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private router:Router) {}
  canLoad() {
    const isAuthenticated = (localStorage.getItem('authenticated') === 'yes') ? true: false;
    if(isAuthenticated) {
      console.log('User is authenticated');

      return true;
    } else {
      console.log('User is not authenticated');
      const navigation = this.router.getCurrentNavigation();
      console.log('current navigation:',navigation);

      let url = '/';
      if(navigation) {
        url = navigation.extractedUrl.toString();
      }
      console.log('Got url:',url);



      // this.router.navigateByUrl('/',{queryparams: {returnToUrl:url}});
      this.router.navigateByUrl('/');
      return false;
    }

  }

}
