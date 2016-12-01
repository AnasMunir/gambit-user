import { Component } from '@angular/core';
import { NavController, Platform, ViewController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-modal-page',
  templateUrl: 'modal-page.html'
})
export class ModalPage {
  name;
  car_color;
  car_make;
  car_model;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public viewCtrl: ViewController,
    public params: NavParams
  ) {
    this.name = this.params.get('fullname');
    this.car_make = this.params.get('car_make');
    this.car_model = this.params.get('car_model');
    this.car_color = this.params.get('car_color');

    console.log(this.name);
    console.log(this.car_make);
    console.log(this.car_model);
    console.log(this.car_color);
  }

  ionViewDidLoad() {
    console.log('Hello ModalPagePage Page');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
