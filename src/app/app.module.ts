import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HttpClientModule} from "@angular/common/http";
import {CourseChoosingPipe} from "../pipes/course-choosing/course-choosing";
import {GetDataProvider} from "../providers/get-data/get-data";
import {GetValidateProvider} from "../providers/get-validate/get-validate";
import {IonicStorageModule} from "@ionic/storage";
import {SortByAlpPipe} from "../pipes/sort-by-alp/sort-by-alp";
import {GroupPage} from "../pages/group/group";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    GroupPage,
    CourseChoosingPipe,
    SortByAlpPipe,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    GroupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GetDataProvider,
    GetValidateProvider
  ]
})
export class AppModule {}
