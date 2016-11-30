import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation, Geoposition } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { LoginPage } from '../login/login';
import 'rxjs/Rx';
import 'rxjs/add/operator/bufferTime'
import { Observable } from 'rxjs/Rx';
import { AuthData } from '../../providers/auth-data';

import { Driver } from '../../models/drivers';

declare var GeoFire: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public fuckShit: any;
  drivers: any[] = [];
  driverKeys: any[] = [];
  map: GoogleMap;
  drivers$: FirebaseObjectObservable<any>;
  driversList$: FirebaseListObservable<any>;
  // buffer: BufferTime<T>

  constructor(public navCtrl: NavController, public platform: Platform,
    public authData: AuthData, public af: AngularFire) {
    platform.ready().then(() => {
      setInterval(this.setLocations, 5000);
      // this.loadMap();
      // setTimeout(this.setLocations(), 5000);
      // this.setLocations();
      // setInterval(this.getNearbyDrivers, 5000);
      this.getNearbyDrivers();
    });
  }
  setLocations() {
    let user = firebase.auth().currentUser;
    let ref = firebase.database().ref('drivers/locations');

    var geoFire = new GeoFire(ref);
    let options = {
        frequency: 3000,
        enableHighAccuracy: true
      };
    Geolocation.getCurrentPosition(options).then((pos: Geoposition) => {
      geoFire.set(user.uid, [pos.coords.latitude, pos.coords.longitude]).then(() => {
        ref.child(user.uid).onDisconnect().remove();
      }).catch(err => {console.log(err)});
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
      center: [31.5158711, 74.3412112],
      radius: 2
    });

    this.drivers$ = this.af.database.object('drivers/');
    // var fuckShit = this.drivers$;
    // this.driversList$ = this.af.database.list('drivers/');
    // var source = Observable.create();
    // source = this.af.database.object('drivers/')

    // var bakwaas = this.drivers$.take(2).subscribe(snapshot => {
    //   geoQuery.on("key_entered", key => {
    //     this.fuckShit = snapshot[key]['fullname'];
    //     this.drivers.push(this.fuckShit);
    //     console.log(this.fuckShit);
    //     console.log(this.drivers);
    //   });
    // });
    geoQuery.on("key_entered", key => {
      var bakwaas = this.drivers$.first().subscribe(snapshot => {
        this.fuckShit = snapshot[key]['fullname'];
        this.drivers.push(this.fuckShit);
        console.log(this.fuckShit);
        console.log(this.drivers);
      });
    });
    // bakwaas.unsubscribe();

  }
  filterByKey(snapshot) {
    return snapshot.$key === this.driverKeys
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
