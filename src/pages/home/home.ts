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
    let options = {
        frequency: 3000,
        enableHighAccuracy: true
      };
    let watch = Geolocation.watchPosition(options);
    watch.subscribe((pos: Geoposition) => {
      this.drivers$.subscribe(snapshot => {
        geoFire.set(user.uid, [pos.coords.latitude, pos.coords.longitude]).then(() => {
          ref.child(user.uid).onDisconnect().remove();
        }).catch(err => {console.log(err)});
      })
    })
    /*watch.subscribe((pos) => {
      if((pos as Geoposition).coords != undefined) {
        var geopos = (pos as Geoposition);
        this.drivers$.subscribe(snapshot => {
          geoFire.set(user.uid, [geopos.coords.latitude, geopos.coords.longitude]).then(() => {
            console.log("location set for user with locations "+geopos.coords.latitude+" "+geopos.coords.longitude);
            // When the user disconnects from Firebase (e.g. closes the app, exits the browser),
            // remove their GeoFire entry
            ref.child(user.uid).onDisconnect().remove();
          }).catch(err => {console.log(err)});
        });
      } else {
        var posError = (pos as PositionError);
        console.log('Error ' + + posError.code + ': ' + posError.message)
      }
    });*/
  //   watch.subscribe((data) => {
  //   //
  // });

  }
  getNearbyDrivers() {
    let user = firebase.auth().currentUser;
    let ref = firebase.database().ref('drivers/locations');
    var geoFire = new GeoFire(ref);

    var geoQuery = geoFire.query({
      center: [31.509661, 74.3176762],
      radius: 2
    });
    let thatDriverObject$ = this.af.database.object('drivers/');

    thatDriverObject$.subscribe(snapshot => {
      geoQuery.on("key_entered", function(key) {
        console.log(snapshot[key]['fullname'] + " entered the query. Hi " + snapshot[key]['fullname'] + "!")
      });
      geoQuery.on("key_exited", function(key) {
        console.log("Bicycle shop " + snapshot[key]['fullname'] + " left query ");
      });
    });
    // watch.unsubscribe();
  }
  getThatDriver(key, location) {
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
    // let user = firebase.auth().currentUser;
    // let ref = firebase.database().ref('drivers/locations');
    // ref.child(user.uid).remove();
    // this.af.auth.logout();
    // this.authData.logoutUser();
    this.navCtrl.setRoot(LoginPage);
  }
}
