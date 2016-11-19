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

  firstNameChanged: boolean = false;
  lastNameChanged: boolean = false;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
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
        this.signupSlider.slideTo(0);
        console.log(this.slideOneForm.value);
      } else {
        this.authData.signUpUser(this.slideOneForm.value.firstName, this.slideOneForm.value.lastName, this.slideOneForm.value.email, this.slideOneForm.value.password)
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
