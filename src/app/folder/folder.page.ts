import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

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
}
