import {Component, Input} from '@angular/core';
import {Item} from "../../models/Item";
import {DataService} from "../../services/DataService";
import {FirebaseData} from "../../DataBase/firebaseData";
import {EditItemComponent} from "../edit-item/edit-item";
import {PopoverController} from "ionic-angular";

/**
 * Generated class for the ItemComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

@Component({
  selector: 'item',
  templateUrl: 'item.html'
})

export class ItemComponent {

  @Input() info : Item;
  authorImg : string;

  constructor(private _ds : DataService,
              private firebase : FirebaseData,
              public popCtrl : PopoverController) {
  }

  ngOnInit() {
    this.authorImg = this._ds.findAuthorImg(this.info);
  }

  parseDate(input : any) : string {
    // This function gets a dateOfCreation as a dateOfCreation or as a string and parse it into a view string
    //** if millisecond = 0 - shows full time: dd/mm/yyyy hh:mm (for updates)
    //** if millisecond = 1 - shows dateOfCreation only: dd/mm/yyyy (for dateOfCreation of creation)
    //** if millisecond = else - shows year only: yyyy (for year of creation, exact dateOfCreation unknown)
    let date : Date = new Date(input);
    let output : string = ''+date.getFullYear();
    let howToShow = date.getMilliseconds();
    if (howToShow <= 1) {
      output = date.getDate() +'/'+ (date.getMonth()+1) +'/'+ output;
      if(howToShow == 0)
        output = ('0'+date.getHours()).slice(-2) +':' + ('0'+date.getMinutes()).slice(-2) + ' ' + output;
    }
    return output;
  }

  onClick() {
    this.info.fullView = !this.info.fullView;
    this._ds.fullViewCnt += (this.info.fullView ? 1 : -1);
    if(this._ds.fullViewCnt == 0) this._ds.fullViewAll = false;
    else this._ds.fullViewAll = true;
  }

  openLink() {
    // window.location.href = this.info.link;
    window.open(this.info.link);
  }

  editItem (item : Item) {
    let popover = this.popCtrl.create(EditItemComponent,item,{enableBackdropDismiss: false});
    popover.present();
    popover.onDidDismiss((newItem)=>{
      if(!newItem) return;
      this.info = newItem;
      this.firebase.updateItem(newItem);
    })
  }
}
