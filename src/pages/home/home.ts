import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users$ : FirebaseObjectObservable<any>;

  constructor(public navCtrl: NavController, public authData: AuthData, public af: AngularFire) {
    // console.log(this.af.auth.getAuth());
     this.users$ = af.database.object('users');
     this.users$.subscribe(val => console.log(val));
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
