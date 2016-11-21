import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
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

  firstNameChanged: boolean = false;
  lastNameChanged: boolean = false;
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
        firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        streetAddress: [''],
        address: this.formBuilder.group({
          city: ['', Validators.required],
          state: ['', Validators.required],
          zipcode: ['', Validators.compose([Validators.maxLength(5), Validators.pattern('[0-9]*')])],
            }),
        phoneNumber: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9]*'), Validators.required])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });

      this.slideTwoForm = formBuilder.group({
        ssn: ['', Validators.compose([Validators.maxLength(11), Validators.pattern('[0-9]*'), Validators.required])],
        drivingCredentials: this.formBuilder.group({
          drivingLicense: ['', Validators.compose([Validators.maxLength(8), Validators.pattern('[0-9]*')])],
          expirationDate: [''],
        }),
        carDetails: this.formBuilder.group({
          carMake: ['', Validators.required],
          carModel: ['', Validators.required],
          carYear: ['', Validators.required],
          carColor: ['', Validators.required],
        })
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
        this.signupSlider.slideTo(0);
        console.log(this.slideOneForm.value);
      } else if(!this.slideTwoForm.valid) {
        this.signupSlider.slideTo(1);
        console.log(this.slideTwoForm.value);
      } else {
        this.authData.signUpUser(
          this.slideOneForm.value.firstName,
          this.slideOneForm.value.lastName,
          this.slideOneForm.value.email,
          this.slideOneForm.value.address.value.streetAddress,
          this.slideOneForm.value.address.value.city,
          this.slideOneForm.value.address.value.state,
          this.slideOneForm.value.address.value.zipcode,
          this.slideOneForm.value.phoneNumber,
          this.slideOneForm.value.password,
          this.slideTwoForm.value.ssn,
          this.slideTwoForm.value.drivingCredentials.value.drivingLicense,
          this.slideTwoForm.value.drivingCredentials.value.expirationDate,
          this.slideTwoForm.value.carDetails.value.carMake,
          this.slideTwoForm.value.carDetails.value.carModel,
          this.slideTwoForm.value.carDetails.value.carYear,
          this.slideTwoForm.value.carDetails.value.carColor,
        )
        .then(() => {
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
