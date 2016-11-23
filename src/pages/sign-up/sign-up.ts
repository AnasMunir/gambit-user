import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormControl, FormControlName, NgControl } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {
  @ViewChild('signupSlider') signupSlider: Slides;

  public slideOneForm;
  public slideTwoForm;

  fullNameChanged: boolean = false;
  emailChanged: boolean = false;
  phoneNumberChanged: boolean = false;
  passwordChanged: boolean = false;


  ssnChanged: boolean = false;

  streetAddressChanged: boolean = false;
  cityChanged: boolean = false;
  stateChanged: boolean = false;
  zipcodeChanged: boolean = false;

  drivingLicenseChanged: boolean = false;
  expirationDataChanged: boolean = false;

  carMakeChanged: boolean = false;
  carModelChanged: boolean = false;
  carYearChanged: boolean = false;
  carColorChanged: boolean = false;

  submitAttempt: boolean = false;
  loading;


  constructor(public navCtrl: NavController, public authData: AuthData,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {

      this.slideOneForm = formBuilder.group({
        // fullName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        fullName: [''],
        // email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        email: [''],
        address: this.formBuilder.group({
          // streetAddress: [''],
          city: [''],
          state: [''],
          // zipcode: [''],
          zipcode: ['', Validators.compose([Validators.maxLength(5), Validators.pattern('[0-9]*')])],
            }),
        phoneNumber: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9]*'), Validators.required])],
      });

      this.slideTwoForm = formBuilder.group({
        ssn: ['', Validators.compose([Validators.maxLength(11), Validators.pattern('[0-9]*'), Validators.required])],
        drivingCredentials: this.formBuilder.group({
          // drivingLicense: ['', Validators.compose([Validators.maxLength(8), Validators.pattern('[0-9]*')])],
          drivingLicense: [''],
          expirationDate: [''],
        }),
        carDetails: this.formBuilder.group({
          carMake: [''],
          carModel: [''],
          carYear: [''],
          carColor: [''],
        }),
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
    }
    /**
    * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
    */
    elementChanged(input){
      let field = input.inputControl.name;
      this[field + "Changed"] = true;
    }
    next(){
      this.signupSlider.slideNext();
    }

    prev(){
      this.signupSlider.slidePrev();
    }

    /**
    * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
    *  component while the user waits.
    *
    * If the form is invalid it will just log the form value, feel free to handle that as you like.
    */
    signupUser(){
      this.submitAttempt = true;

      if (!this.slideOneForm.valid){
        // this.signupSlider.slideTo(0);
        console.log(this.slideOneForm.value);
      } else if(!this.slideTwoForm.valid) {
        console.log(this.slideTwoForm.value);
      } else {
        this.authData.signUpUser(
          this.slideOneForm.value.fullName,
          this.slideOneForm.value.email,
          // this.slideOneForm.value.address.streetAddress,
          this.slideOneForm.value.address.city,
          this.slideOneForm.value.address.state,
          this.slideOneForm.value.address.zipcode,
          this.slideOneForm.value.phoneNumber,
          this.slideTwoForm.value.ssn,
          this.slideTwoForm.value.drivingCredentials.drivingLicense,
          this.slideTwoForm.value.drivingCredentials.expirationDate,
          this.slideTwoForm.value.carDetails.carMake,
          this.slideTwoForm.value.carDetails.carModel,
          this.slideTwoForm.value.carDetails.carYear,
          this.slideTwoForm.value.carDetails.carColor,
          this.slideTwoForm.value.password,
        ).then(() => {
          this.navCtrl.setRoot(HomePage);
        }, (error) => {
          this.loading.dismiss().then( () => {
            var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });

        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();
      }
    }

  ionViewDidLoad() {
    console.log('Hello SignUpPage Page');
  }

}
