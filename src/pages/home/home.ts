import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, Events, NavController} from 'ionic-angular';
import {clone, DataService} from "../../services/DataService";
import {ItemComponent} from "../../components/item/item"
import {Item} from "../../models/Item";
import {FirebaseData} from "../../DataBase/firebaseData";
import {ITEMS} from "../../DataBase/DataBase";
import {TextPage} from "../text/text";
import {CreatePage} from "../create/create";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Content) content: Content;

  dbItems;

  constructor(public navCtrl: NavController,
              private alertCtrl : AlertController,
              public events : Events,
              private _ds : DataService,
              private firebase : FirebaseData,
              )
  {
    this.dbItems = ITEMS;
    this.events.subscribe('scrollUp',()=>{this.content.scrollToTop()})
  }

  signInPrompt() {
    let alert = this.alertCtrl.create({
      title : 'כניסת למצב עריכה',
      inputs : [
        {
          name : 'email',
          placeholder : 'הכנס כתובת מייל'
        },
        {
          name : 'password',
          placeholder : 'הכנס סיסמא',
          type : 'password'
        }
      ],
      buttons : [
        {
          text : 'כניסה',
          handler : (data)=>{
            this.firebase.editorSignIn(data.email,data.password);
          },
        },
        {
          text : 'ביטול',
          role : 'cancel',
        }
      ]
    });
    alert.present()
  }

  signOutPrompt() {
    let alert = this.alertCtrl.create({
      title: 'האם לצאת ממצב עריכה?',
      buttons: [
        {
          text : 'יציאה',
          handler : ()=>{
            this.firebase.editorSignOut();
          }
        },
        {
          text : 'ביטול',
          role : 'cancel'
        }
      ]
    });
    alert.present();
  }

  showTrash() {
    this._ds.items = clone(this._ds.trashList);
    this._ds.onSearch();
    this._ds.viewTrash = true;
  }

  unshowTrash() {
    this._ds.viewTrash = false;
    this._ds.onSearch();
    this.firebase.refreshConnection();
  }

  showHistoryPage() {
    this.navCtrl.push(TextPage,'history');
  }

  showAuthorsPage() {
    this.navCtrl.push(TextPage,'authors');
  }

  goToCreatePage() {
    this.navCtrl.push(CreatePage);
  }

  createList() {
    this.navCtrl.push(TextPage,'list');
  }

  goToSite() {
    window.open('https://www.facebook.com/IsraeliFreedomMovement/');
  }
}
