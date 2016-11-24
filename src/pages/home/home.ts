import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, Geoposition } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { GoogleMaps } from '../../providers/google-maps'
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { AuthData } from '../../providers/auth-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: GoogleMap;
  users$: FirebaseObjectObservable<any>;
  ionViewDidLoad() {
    this.loadMap();
    console.log('Hello LoginPage Page');
  }
  constructor(public navCtrl: NavController, public platform: Platform, public authData: AuthData) {
    platform.ready().then(() => {
      this.loadMap();
    });
  }

  loadMap() {

    let location = new GoogleMapsLatLng(-34.9290,138.6010);
    this.map = new GoogleMap('map', {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': location,
        'tilt': 30,
        'zoom': 15,
        'bearing': 50
      }
    });
    // Geolocation.getCurrentPosition().then(position => {
    //   let location = new GoogleMapsLatLng(position.coords.latitude, position.coords.longitude);
    // })
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      // this.map.showDialog();
      console.log('Map is ready!');
    });

  }
  logoutUser() {
    this.authData.logoutUser().then( authData => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
