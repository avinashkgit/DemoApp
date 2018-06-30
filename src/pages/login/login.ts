import { AngularFireAuthModule } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { Observable } from 'rxjs';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'LoginPage'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  FB_APP_ID: number = 1048643378649899;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: Facebook,
    public nativeStorage: NativeStorage,
    public googlePlus: GooglePlus,
    public loadingCtrl: LoadingController,
    public aFAuth: AngularFireAuthModule
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  fbLogin() {
    let permissions = new Array<string>();
    let nav = this.navCtrl;
    let env = this;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];


    this.fb.login(permissions)
      .then((response) => {
        let userId = response.authResponse.userID;
        let params = new Array<string>();

        //Getting name and gender properties
        env.fb.api("/me?fields=name,gender", params)
          .then((user) => {
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
            //now we have the users info, let's save it in the NativeStorage
            env.nativeStorage.setItem('user',
              {
                name: user.name,
                gender: user.gender,
                picture: user.picture
              })
              .then(() => {
                nav.push('HomePage').then(() => {
                  const index = nav.getActive().index;
                  nav.remove(0, index);
                });
              }, (error) => {
                alert("fb login failed");
                console.log(error);
              })
          })
      }, (error) => {
        alert("fb login failed");
        console.log(error);
      });
  }

  googleLogin() {
    let nav = this.navCtrl;
    let env = this;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '714001825569-ffrfc2v2fu485itvo6mma63gi2pcc831.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    }).then((user) => {
      loading.dismiss();
     
      env.nativeStorage.setItem('user', {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl
      })
        .then(function () {
          nav.push('HomePage').then(() => {
            const index = nav.getActive().index;
            nav.remove(0, index);
          });;
        }, (error) => {
          alert("google login failed");
          console.log(error);
        })
    }, (error) => {
      alert("google login failed");
      loading.dismiss();
    });
  }

}
