import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { ModalPage } from '../pages/modal-page/modal-page';
import { LoginPage } from '../pages/login/login';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignUpPage } from '../pages/sign-up/sign-up';

// Importing provider
import { AuthData } from '../providers/auth-data';
// import { ConnectivityService } from '../providers/connectivity-serveice';
import { ConnectivityService } from '../providers/connectivity-service';

// Import the AF2 Module
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

export const firebaseConfig = {
  apiKey: "AIzaSyAPl8CEm1VBFfaAZ-B0fY_CEyR3PUXmm-c",
  authDomain: "user-tracking-af847.firebaseapp.com",
  databaseURL: "https://user-tracking-af847.firebaseio.com",
  storageBucket: "user-tracking-af847.appspot.com",
  messagingSenderId: "840819858389"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ResetPasswordPage,
    SignUpPage,
    ModalPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ResetPasswordPage,
    SignUpPage,
    ModalPage
  ],
  providers: [AuthData, ConnectivityService]
})
export class AppModule {}
