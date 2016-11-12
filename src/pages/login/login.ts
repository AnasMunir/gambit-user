import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

// for form validation
import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
// our auth provider
import { AuthData } from '../../providers/auth-data';
// the required pages to navigate to
import { HomePage } from '../home/home';
import { SignUpPage } from '../sign-up/sign-up';
import { ResetPasswordPage } from '../reset-password/reset-password';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm: any;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
  }

  constructor(public navCtrl: NavController,public authData: AuthData,
    public formBuilder: FormBuilder, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {

      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }
  goToResetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }
  createAccount() {
    this.navCtrl.push(SignUpPage);
  }
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  loginUser(){
    this.submitAttempt = true;

    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then( authData => {
        this.navCtrl.setRoot(HomePage);
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
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

}
