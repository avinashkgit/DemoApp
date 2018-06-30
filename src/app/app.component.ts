import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = '';

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public nativeStorage: NativeStorage,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.nativeStorage.getItem('user')
        .then((data) => {
          // user is previously logged and we have his data
          // we will let him access the app
          this.rootPage = 'HomePage'
        }, (error) => {
          //we don't have the user data so we will ask him to log in
          this.rootPage = 'LoginPage'
        });

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

