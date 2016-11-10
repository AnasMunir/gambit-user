import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthData {
  fireAuth: any;
  users$ : FirebaseObjectObservable<any>;
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
    .then(logUser => {
      var ref = firebase.database().ref('/');
      ref.child('users').child(logUser.uid).update({logged: true});
    })
  }
  resetPassword(email: string): any {
    return firebase.auth().sendPasswordResetEmail(email);
  }
  logoutUser(): any {
    return this.af.auth.logout();
  }
  signUpUser(newEmail: string, newPassword: string): any {
    // return firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword);
    return this.af.auth.createUser(
      { email: newEmail,
        password: newPassword }).then(regUser => {

          var ref = firebase.database().ref('/');
          ref.child('users').child(regUser.uid).set({email: newEmail});
        }).catch(err => {console.log(err)});
  }
}
