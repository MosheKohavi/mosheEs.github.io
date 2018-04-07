import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {Content, IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {DataService} from "../services/DataService";
import {ItemComponent} from "../components/item/item";
import {SearchComponent} from "../components/search/search";
import {CriteriaComponent} from "../components/criteria/criteria";
import {KeyComponent} from "../components/key/key";
import {PersonComponent} from "../components/person/person";
import {firebaseConfig, FirebaseData} from "../DataBase/firebaseData";
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuth, AngularFireAuthModule} from "angularfire2/auth";
import {TextPage} from "../pages/text/text";
import {EditItemComponent} from "../components/edit-item/edit-item";
import {EditPersonComponent} from "../components/edit-person/edit-person";
import {MobilePopComponent} from "../components/mobile-pop/mobile-pop";
import {CreatePage} from "../pages/create/create";
import {HttpModule, JsonpModule} from "@angular/http";
import {MobileHomePage} from "../pages/mobile-home/mobile-home";
import {EditorService} from "../services/EditorService";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CreatePage,
    TextPage,
    ItemComponent,
    SearchComponent,
    CriteriaComponent,
    KeyComponent,
    PersonComponent,
    EditItemComponent,
    EditPersonComponent,
    MobileHomePage,
	MobilePopComponent,
      ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig,'FreedomLibrary'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    JsonpModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CreatePage,
    TextPage,
    ItemComponent,
    SearchComponent,
    CriteriaComponent,
    KeyComponent,
    PersonComponent,
    EditItemComponent,
    EditPersonComponent,
    MobileHomePage,
	MobilePopComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DataService,
    FirebaseData,
    EditorService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
