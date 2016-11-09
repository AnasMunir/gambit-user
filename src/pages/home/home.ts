import { Component } from '@angular/core';
import { Geolocation, Geoposition } from 'ionic-native';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

declare var google;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users$: FirebaseObjectObservable<any>;
  userData$: FirebaseListObservable<any>;
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public latLng: any;
  public locations;

  constructor(public navCtrl: NavController, public authData: AuthData, public af: AngularFire) {
    // console.log(this.af.auth.getAuth());
    var user = firebase.auth().currentUser;
    this.users$ = af.database.object('users/'+user.uid);
    this.userData$ = af.database.list('users/');
    // this.users$.update({university: 'comsats'});
    // this.users$.update({lat: this.lat, lng: this.lng});
     this.userData$.subscribe(val => {
       console.log(val);
       val.forEach(val => {
         return this.locations = {lat: val.lat, lng: val.lng};
       })
       this.Print(this.locations);
      //  console.log('lat: '+ this.locations);
      //  console.log('lat: '+ this.locations.lat);
      //  console.log('lng: '+ this.locations.lng);
     });

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };
    this.watch = Geolocation.watchPosition(options).subscribe((position: Geoposition) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      this.lat = position.coords.latitude; this.lng = position.coords.longitude
      this.users$.subscribe(() => {
        this.users$.update({lat: this.lat, lng: this.lng});
      })
    })
  }
  logoutUser() {
    this.authData.logoutUser().then( authData => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
  Print(val) {
    var latLng = [] = val;
    console.log(latLng);
  }
}
