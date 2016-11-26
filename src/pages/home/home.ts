import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, Geoposition } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { AuthData } from '../../providers/auth-data';
declare var GeoFire: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: GoogleMap;
  drivers$: FirebaseObjectObservable<any>;

  constructor(public navCtrl: NavController, public platform: Platform,
    public authData: AuthData, public af: AngularFire) {
    platform.ready().then(() => {
      // this.loadMap();
      this.setLocations();
      this.getNearbyDrivers();
    });
  }
  setLocations() {
    let user = firebase.auth().currentUser;
    let ref = firebase.database().ref('drivers/locations');

    var geoFire = new GeoFire(ref);
    this.drivers$ = this.af.database.object('drivers/'+user.uid);
    Geolocation.getCurrentPosition().then(pos => {
      this.drivers$.subscribe(snapshot => {
        geoFire.set(snapshot.fullname, [pos.coords.latitude, pos.coords.longitude]).then(() => {
          console.log("location set for user with locations "+pos.coords.latitude+" "+pos.coords.longitude);
        }).catch(err => {console.log(err)});
        console.log(snapshot);
      });

    }).catch(err => {console.log(err)});

  }
  getNearbyDrivers() {
    let user = firebase.auth().currentUser;
    let ref = firebase.database().ref('drivers/locations');
    var geoFire = new GeoFire(ref);

    var geoQuery = geoFire.query({
      center: [31.509661, 74.3176762],
      radius: 2
    });

    geoQuery.on("key_entered", function(key, location) {
      console.log(key + " entered the query. Hi " + key + "!");
    });
  }
  loadMap() {

    // let location = new GoogleMapsLatLng(-34.9290,138.6010);
    Geolocation.getCurrentPosition().then(position => {
      let location = new GoogleMapsLatLng(position.coords.latitude, position.coords.longitude);

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

    })
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      // this.map.showDialog();
      console.log('Map is ready!');
    });

  }
  logoutUser() {
    this.navCtrl.setRoot(LoginPage);
    // this.authData.logoutUser().then( authData => {
    // });
  }
}
