import { Component } from '@angular/core';
import {NavParams, Platform, ViewController} from "ionic-angular";



@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {


  constructor(public platform: Platform,
              public params: NavParams,
              public viewCtrl: ViewController) {
  }

  groups = this.params.get('data');

  dismiss(){
    this.viewCtrl
      .dismiss();
  }

}
