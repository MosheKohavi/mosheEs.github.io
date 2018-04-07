import {Injectable, ViewChild} from "@angular/core";
import {Item} from "../models/Item";
import {InfoTypeObj} from "../models/infoType";
import {AlertController, Events, LoadingController, Platform, PopoverController} from "ionic-angular";
import {Person} from "../models/Person";
import {AUTHOR_LIST, ITEMS} from "../DataBase/DataBase";
import {Lang} from "../models/LangEnum";
import {Content} from "ionic-angular";

export function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

export const NO_IMG : string = 'http://u.o0bc.com/avatars/no-user-image.gif';

@Injectable()

export class DataService {

  //Main variables/consts:
  version : {primary : number, secondary : number} = {primary : 2, secondary : 0};
  mobile : boolean;
  mainUrl : string;
  EDITOR_MODE : boolean = false;
  showSignInButton : boolean = false;

  authorList : Person[] = [];

  items : Item[] = [];

  trashList : Item[] = [];
  viewTrash : boolean = false;

  filteredItems : Item[];
  pages : Item[][] = [];
  itemsPerPage : number = 50;
  shownPage : number = 0;

  filterKeys : string[] = [];

  filterType : InfoTypeObj = null;

  query : string;

  maxFilters = 5;

  fullViewAll : boolean = false;
  fullViewCnt : number = 0;

  showLang = {
    he : true,
    en : true
  };

  sortBy : string ='rand';

  recommendedOnly : boolean = false;

  shownPerson : Person = null;

  pageUrlSearch : string;

  constructor (public alertCtrl : AlertController,
               public events : Events,
               public loader : LoadingController,
               public platform : Platform,
               ) {		 				   
    this.mobile = platform.is('mobile');
    this.mainUrl = this.getMainUrl();
    this.filteredItems = clone(this.items);
    this.setViewToAll();
    this.getInfoFromUrl();
  }
  
  showAtStart() {
	  this.filteredItems = clone(this.items);
	  this.sortBy = 'rand';
	  this.sortItems();
  }

  getMainUrl() {
    let str : string = window.location.href;
    str = str.slice(0,str.indexOf('?'));
    return str;
  }

  onSearch(fnStr? : string) {
    let load = this.loader.create({content : 'מחפש...'});
    load.present().then(()=>{
	  // starts the loader and activate one of these two functions:
	  switch (fnStr) {
		case 'divPage': this.divToPages(); break;
		case 'sort': this.sortItems(); break;
		default: this.searchStart(); break;
	  }
    });
    load.dismiss();
  }

  searchStart() {
    this.filteredItems = clone(this.items);
    let keys : string[] = clone(this.filterKeys);
    let q = this.query;
    if(this.query && this.query.charAt(this.query.length-1) == ' ') q = this.query.slice(0,-1);
    keys.push(q);
    console.log('Search keys:'); console.log(keys);
    this.filteredItems = this.filteredItems.filter((item) => {
      /* filter Function: <for each item>*/
      if(item.language == Lang.he && !this.showLang.he) return (false);                                               // Check languages
      if(item.language == Lang.en && !this.showLang.en) return (false);                                               //
      if(this.filterType && this.filterType.caption != item.type.caption) return (false);                             // if not equal to the chosen criteria - filter out.
      if(this.recommendedOnly && !item.recommended) return(false);                                                    // filter out not recommended if needed.
        if(keys.length == 1 && !keys[0]) return true;                                                                 // if there are no filters - show all
        let searchIn : string = `${item.title},${item.author.name},${item.group.name},${item.abstract},${item.keywords.toString()}`;
        for (let i = 0; i < keys.length; i++) {                                                                       // start check keys
          if(!keys[i]) continue;                                                                                      // if the search key is empty - skip.
          if(searchIn.toLowerCase().indexOf(keys[i].toLowerCase()) == -1)                                             // if one of the search keys does not exist filter out
            return false;
        }
        // if pass all keys, filter in:
        return true;
      });
    //Search ends
    this.fullViewAll = false;
    this.setViewToAll();
    this.sortItems();
    this.events.publish('scrollUp');
    console.log('Filtered items:'); console.log(this.filteredItems);
    this.divToPages();
  }

  divToPages() {
	this.pages = [];
	this.shownPage = 0;
    let m = Math.floor(this.filteredItems.length / this.itemsPerPage);
	for (let i = 0; i <= m; i++) {
	  let arr = clone(this.filteredItems);
	  this.pages[i] = arr.splice(i*this.itemsPerPage,this.itemsPerPage);
	}	
    console.log(this.pages);
  }
  
  startLoader() {
	let load = this.loader.create();
    load.present().then(()=>{});
	load.dismiss();
  }

  addFilter(key : string) {
    if(key.charAt(key.length-1) == ' ') key = key.slice(0,-1);
    // checks if not already exist:
    for (let i = 0; i < this.filterKeys.length; i++)
      if(this.filterKeys[i] == key) {
        let alert = this.alertCtrl.create({
          title : 'מסנן זה כבר קיים',
          buttons : ['בסדר']
        });
        alert.present();
        return;
      }
    // then, check if there ara not too many filters:
    if(this.filterKeys.length >= this.maxFilters) {
      let alert = this.alertCtrl.create({
        title : 'יותר מדיי מסננים',
        subTitle : 'ניתן להוסיף עד ' + this.maxFilters + ' מסננים.',
        buttons : ['בסדר']
      });
      alert.present();
      return;
    }
    this.filterKeys.push(key);
    this.query = "";
    this.onSearch();
  }

  removeFilter(index) {
    if (this.shownPerson && this.shownPerson.name == this.filterKeys[index]) this.shownPerson = null;
    this.filterKeys.splice(index,1);
    this.onSearch();
  }

  getInfoFromUrl()
  {
    // gets url last part:
    this.pageUrlSearch = decodeURIComponent(window.location.search);
    // If there isn't '?', don't do anything:
    if(this.pageUrlSearch.indexOf('?') == -1) return;
    // Check editor page:
    if(this.pageUrlSearch.indexOf('?$EDITOR_PAGE$') > -1) {
      // Editor mode is unable in mobile:
      if(this.mobile) {
        this.EDITOR_MODE = false;
      }
      else
        this.showSignInButton = true;
      return;
    }
    // After the '?', get the search words (separated by '&') and add them as filters:
    let str = this.pageUrlSearch.slice(this.pageUrlSearch.indexOf('?')+1);
    let split = str.split("&");
    for (let i = 0; i < split.length; i++) {
      console.log(split[i]);
      split[i] = split[i].replace(/_/g," "); // (Replaces *all* '_' in ' ')
      this.addFilter(split[i]);
    }
  }

  createUrlForFilters() {
    let str = '?';
    if(this.query) str+= this.query;
    for (let i = 0; i <this.filterKeys.length; i++) {
      if(i != 0 || this.query) str+='&';
      str += this.filterKeys[i];
    }
    // str.replace(' ','_');
    str = this.mainUrl + str;
    prompt('קישור לתוצאות החיפוש הנוכחי:',str);
  }

  sortItems() {
      if(this.sortBy == 'abc')
        this.filteredItems.sort((a : Item, b : Item) => {
        if (a.title > b.title) return 1;
        else return - 1;
      });
      if(this.sortBy == 'date')
        this.filteredItems.sort((a : Item, b : Item) => {
          let aTime = a.timeOfUpdate[0];
          let bTime = b.timeOfUpdate[0];
          // later is first:
          if(aTime < bTime) return 1;
          else return -1;
        });
	  if(this.sortBy == 'rand') {
		this.filteredItems.sort((a : Item, b : Item) => {
        if (Math.random() > Math.random()) return 1;
        else return - 1;
      });
	  }
      this.divToPages();
  }

  findAuthorImg(item : Item) {
    let image : string;
    image = item.author.img;
    if(!image || image == NO_IMG)
      image = item.group.img;
    return image || NO_IMG;

    // let authorImg : string;
    // // find author and take his picture:
    // for (let i = 0; i < this.authorList.length; i++) {
    //   if (this.authorList[i].name == item.author.name) {
    //     authorImg = this.authorList[i].img;
    //     if (!authorImg || authorImg == NO_IMG) break;
    //     return(authorImg);
    //   }
    // }
    // // if the author is not in the list or there is no picture, try to find group picture:
    // for (let i = 0; i < this.authorList.length; i++) {
    //   if (this.authorList[i].name == item.group.name) {
    //     authorImg = this.authorList[i].img;
    //     if (!authorImg) break;
    //     return(authorImg);
    //   }
    // }
    // // if there are no pictures for the author nor the group, use anonymius image:
    // return(NO_IMG);
  }

  showPerson(author : Person) {
    this.addFilter(author.name);
    this.shownPerson = author;
  }

  setViewToAll() {
    if(this.fullViewAll) this.fullViewCnt = this.filteredItems.length;
    else this.fullViewCnt = 0;
    for (let i = 0; i < this.filteredItems.length; i++)
      this.filteredItems[i].fullView = this.fullViewAll;
	this.divToPages();
  }

  createBackUpAsJson() {
	localStorage.setItem('offlineITEMS',JSON.stringify(this.items));
	localStorage.setItem('offlineAUTHORS',JSON.stringify(this.authorList));
    alert('items & authors were saved to local storage');
  }

}
