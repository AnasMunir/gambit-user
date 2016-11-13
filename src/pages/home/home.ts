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
  driversData$: FirebaseListObservable<any>;
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public latLng: any;
  public locations: any;
  public driverList = [];

  ionViewDidLoad() {
    console.log('Hello Home Page');
    this.loadGoogleMaps();
  }

  constructor(public navCtrl: NavController, public authData: AuthData,
    public af: AngularFire, public connectivityService: ConnectivityService) {
      // this.addMarker();

      var user = firebase.auth().currentUser;
      this.users$ = this.af.database.object('users/'+user.uid);
      this.driversData$ = this.af.database.list('drivers/');
      // this.getDistance();
      let options = {
        frequency: 3000,
        enableHighAccuracy: true
      };
      this.watch = Geolocation.watchPosition(options).subscribe((position: Geoposition) => {
        // console.log(position.coords.latitude);
        // console.log(position.coords.longitude);
        this.lat = position.coords.latitude; this.lng = position.coords.longitude
        this.driversData$.subscribe(val => {
          val.forEach(val => {
            //if(val.logged){
            this.driverList.push({lat: val.lat, lng: val.lng});
              // this.getDistance(this.lat, this.lat, this.driverList);
              // console.log(this.driverList);
              // console.log(val.email + ' ' + 'lat ' +val.lat);
              // console.log(val.email + ' ' + 'lng ' +val.lng);
            //}
          });
          console.log(this.driverList);
          this.getDistance(this.lat, this.lng, this.driverList);
        });

        this.marker.setPosition(new google.maps.LatLng(this.lat,this.lng));
        this.users$.subscribe(() => {
          // this.moveMarker(this.lat, this.lng);
          this.users$.update({lat: this.lat, lng: this.lng});
        })
      });
  }
  /*getDrivers() {
    this.driversData$ = this.af.database.list('drivers/');
    this.driversData$.subscribe(val => {
      val.forEach(val => {
        //if(val.logged){
          this.driverList.push({lat: val.lat, lng: val.lng});
          // console.log(this.driverList);
          console.log(val.email + ' ' + 'lat ' +val.lat);
          console.log(val.email + ' ' + 'lng ' +val.lng);
        //}
      });
    });
  }*/
  logoutUser() {
    this.users$.subscribe(() => {
      // this.moveMarker(this.lat, this.lng);
      this.users$.update({logged: false});
    })
    this.authData.logoutUser().then( authData => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
  getDistance(lat, lng, drivers: any[]) {

    var origin1 = {lat: lat, lng: lng};
    // var origin2 = 'Lahore, Pakistan';
    // var destinationA = 'Lahore, Pakistan';
    var destinationB = {lat: 50.087, lng: 14.421};
    // var destinationB = drivers;
    console.log(drivers);
    // var geocoder = new google.maps.Geocoder;

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: drivers,
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, (response, status) => {
        if (status !== 'OK') {
          alert('Error was: ' + status);
      } else {
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;
        // console.log(originList);
        console.log(destinationList);
        for (var i = 0; i < originList.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++) {
            var element = results[j];
            var distance = element.distance.text;
            var duration = element.duration.text;
            var from = originList[i];
            var to = destinationList[j];
            console.log('from ' + from);
            console.log('to ' + to);

          }
        }
        console.log('Entire response: ');
        console.log(response);
        console.log('distance ' + distance);
        console.log('duration ' + duration);
        }
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
    var user = firebase.auth().currentUser;
    var ref = firebase.database().ref('drivers/'+user.uid);
    Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      // this.getDistance();
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
  // addArrayMarker(lat, lng) {
  //   let marker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: {lat, lng}
  //   });
  // }

  disableMap(){
    console.log("disable map");
  }

  enableMap(){
    console.log("enable map");
  }
}
