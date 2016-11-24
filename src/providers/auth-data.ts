import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthData {
  fireAuth: any;
  drivers$ : FirebaseObjectObservable<any>;
  constructor(public af: AngularFire) {
    af.auth.subscribe( user => {
      if (user) {
        this.fireAuth = user.auth;
        console.log(user);
      }
    });
  }
  loginUser(newEmail: string, newPassword: string): any {
    return this.af.auth.login({email: newEmail, password: newPassword})
  }
  resetPassword(email: string): any {
    return firebase.auth().sendPasswordResetEmail(email);
  }
  logoutUser(): any {
    return this.af.auth.logout();
  }
  signUpUser(
    newFirstUser: string,
    newEmail: string,
    // newStreetAddress: string,
    newCity: string,
    newState: string,
    newZipCode: string,
    newPhoneNumber: string,
    newSSN: string,
    newDrivingLicense: string,
    newExpirationDate: string,
    newCarMake: string,
    newCarModel: string,
    newCarYear: string,
    newCarColor: string,
    newPassword: string): any {
    // return firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword);
    return this.af.auth.createUser(
      { email: newEmail,
        password: newPassword }).then(regUser => {

          var ref = firebase.database().ref('/');
          ref.child('drivers').child(regUser.uid).set({
            fullname: newFirstUser,
            email: newEmail,
            // streetAddress: newStreetAddress,
            city: newCity,
            state: newState,
            zipcode: newZipCode,
            phonenumber: newPhoneNumber,
            ssn: newSSN,
            drivingLicense: newDrivingLicense,
            expirationDate: newExpirationDate,
            car_make: newCarMake,
            car_model: newCarModel,
            car_year: newCarYear,
            car_color: newCarColor
          });
        }).catch(err => {console.log(err)});
  }
}
