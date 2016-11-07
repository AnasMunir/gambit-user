import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public authData: AuthData) {
    // var user = firebase.auth().currentUser;
    // if (user) {
    //
    // }
  }
  logoutUser() {
    this.authData.logoutUser().then( authData => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
