import { Component } from '@angular/core';
import { Geolocation, Geoposition } from 'ionic-native';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users$ : FirebaseObjectObservable<any>;
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public latLng: any;

  constructor(public navCtrl: NavController, public authData: AuthData, public af: AngularFire) {
    // console.log(this.af.auth.getAuth());
    var user = firebase.auth().currentUser;
     this.users$ = af.database.object('users/'+user.uid);
     this.users$.update({university: 'comsats'});
    //  this.users$.subscribe(val => console.log(val));
    var user = firebase.auth().currentUser;
    console.log(user);
    // if (user) {
    //
    // }
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };
    this.watch = Geolocation.watchPosition(options).subscribe((position: Geoposition) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      // this.locations$.update({lat: position.coords.latitude, lng: position.coords.longitude});
      // this.moveMap(this.latLng);
    })
  }
  logoutUser() {
    this.authData.logoutUser().then( authData => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
/*return this.af.auth.createUser(
  { email: newEmail,
    password: newPassword }).then(regUser => {
      // var ref = firebase.database().ref.child('users/').set(regUser.uid);
      // this.users$ = this.af.database.object('Users');

      var ref = firebase.database().ref('/');
      ref.child('users').child(regUser.uid).set({email: newEmail});
    }).catch(err => {console.log(err)});*/
