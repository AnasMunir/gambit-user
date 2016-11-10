import { Component, ElementRef, ViewChild } from '@angular/core';
import { Geolocation, Geoposition } from 'ionic-native';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { LoginPage } from '../login/login';


// providers
import { ConnectivityService } from '../../providers/connectivity-service';
import { AuthData } from '../../providers/auth-data';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;

  map: any; marker: any;
  mapInitialised: boolean = false;
  apiKey: 'AIzaSyA3inoU1ZODu-c4Nd-5bYC3Wr2Wt-9myLI';

  users$: FirebaseObjectObservable<any>;
  userData$: FirebaseListObservable<any>;
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public latLng: any;
  public locations: any;

  constructor(public navCtrl: NavController, public authData: AuthData,
    public af: AngularFire, public connectivityService: ConnectivityService) {
      this.loadGoogleMaps();
      // this.addMarker();

      var user = firebase.auth().currentUser;
      this.users$ = this.af.database.object('users/'+user.uid);
      let options = {
        frequency: 3000,
        enableHighAccuracy: true
      };
      this.watch = Geolocation.watchPosition(options).subscribe((position: Geoposition) => {
        // console.log(position.coords.latitude);
        // console.log(position.coords.longitude);
        this.lat = position.coords.latitude; this.lng = position.coords.longitude
        // this.addMarker(this.lat, this.lng);
        this.marker.setPosition({lat: this.lat, lng: this.lng});
        this.users$.subscribe(() => {
          // this.moveMarker(this.lat, this.lng);
          this.users$.update({lat: this.lat, lng: this.lng});
        })
      });

      this.userData$ = this.af.database.list('users/');

      this.userData$.subscribe(val => {

        val.forEach(val => {
          if(val.logged){
            console.log('lat '+ val.email + ' ' +val.lat);
            console.log('lng '+ val.email + ' ' +val.lng);
            this.addMarker(val.lat, val.lng);
          } else {
            console.log(val.email + ' user is logged out');
          }
          // this.locations = {lat: val.lat, lng: val.lng};
          // console.log(val.lat);
        });
        // let marker = new google.maps.Marker({
        //   map: this.map,
        //   animation: google.maps.Animation.DROP,
        //   position: this.locations//this.map.getCenter()
        // });
      });

  }
  moveMarker(lat, lng) {
    let center = new google.maps.LatLng(lat, lng);
    this.marker.setPosition({lat: lat, lng: lng});
    var flightPlanCoordinates = [
          {lat: lat, lng: lng}
        ];
        var flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        flightPath.setMap(this.map);
  }
  logoutUser() {
    // var user = firebase.auth().currentUser;
    // this.users$ = this.af.database.object('users/'+user.uid);
    // this.users$.update({logged: true});
    this.users$.subscribe(() => {
      // this.moveMarker(this.lat, this.lng);
      this.users$.update({logged: false});
    })
    this.authData.logoutUser().then( authData => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

  Print(val) {
    var latLng = [] = val;
    console.log('Print: ')
    console.log(latLng);
  }
  loadGoogleMaps() {
    this.addConnectivityListeners();

    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();
      if(this.connectivityService.isOnline()){
        console.log("online, loading map");
        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        }
        let script = document.createElement("script");
        script.id = "googleMaps";
        // script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
        // script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA3inoU1ZODu-c4Nd-5bYC3Wr2Wt-9myLI&callback=initMap'
        if(this.apiKey){
          script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyA3inoU1ZODu-c4Nd-5bYC3Wr2Wt-9myLI&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
        }
        document.body.appendChild(script);
      }
    } else {
      if(this.connectivityService.isOnline()){
        console.log("showing map");
        this.initMap();
        this.enableMap();
      }
      else {
        console.log("disabling map");
        this.disableMap();
      }
    }
  }

  addConnectivityListeners() {
    let onOnline = () => {
      setTimeout(() => {
        if(typeof google == "undefined" || typeof google.maps == "undefined"){
          this.loadGoogleMaps();
        } else {
          if(!this.mapInitialised){
            this.initMap();
          }
          this.enableMap();
        }
      }, 2000);
    }
    let onOffline = () => {
      this.disableMap();
    };
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
  }

  initMap(){
    this.mapInitialised = true;
    Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      return this.addMarker(position.coords.latitude, position.coords.longitude);
    });
  }
  addMarker(lat, lng) {
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat, lng}
    });
  }

  disableMap(){
    console.log("disable map");
  }

  enableMap(){
    console.log("enable map");
  }
}
