import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'HomePage'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  user: any;
  userReady: boolean = false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: Facebook,
    public googlePlus: GooglePlus,
    public nativeStorage: NativeStorage
  ) {
  }

  ionViewDidLoad() {
    let env = this;
    this.nativeStorage.getItem('user')
      .then((data) => {
        env.user = {
          name: data.name,
          gender: data.gender,
          picture: data.picture
        };
        env.userReady = true;
      }, (error) => {
        console.log(error);
      });
  }

  logout() {
    let nav = this.navCtrl;
    let env = this;
    this.fb.logout();
    this.googlePlus.logout();

    env.nativeStorage.remove('user');
    nav.push('LoginPage').then(() => {
      const index = nav.getActive().index;
      nav.remove(0, index);
    });
  }

  showMap() {
    this.navCtrl.push('MapPage');
  }

}
