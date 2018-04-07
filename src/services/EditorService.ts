import {Injectable} from "@angular/core";
import {clone, DataService, NO_IMG} from "./DataService";
import {Person} from "../models/Person";
import {FirebaseData} from "../DataBase/firebaseData";
import {Lang} from "../models/LangEnum";
import {InfoType} from "../models/infoType";
import {AIMG} from "../assets/Article Image";
import {EditPersonComponent} from "../components/edit-person/edit-person";
import {AlertController, PopoverController} from "ionic-angular";

@Injectable()

export class EditorService {
  constructor (private _ds : DataService,
               private firebase : FirebaseData,
               public popoverCtrl : PopoverController,
               public alertCtrl : AlertController,
  ) {}

  setAuthor(name : string) : Person {
    // if name is empty, no author
    if(!name) return (new Person());
    // Get name and return the Person object, if exists:
    for(let i = 0; i < this._ds.authorList.length; i++)
      if(this._ds.authorList[i].name == name)
        return(this._ds.authorList[i]);
    // If does not exist, create in server and return it:
    let newPerson = new Person();
    newPerson.name = name;
    newPerson.img = NO_IMG;
    this.firebase.addPersonToServer(newPerson);
    this._ds.authorList.push(newPerson);                //push it temporary to avoid multi copies on server.
    return (newPerson);
  }

  editPerson(person) {
    let popover = this.popoverCtrl.create(EditPersonComponent,person);
    popover.present();
    popover.onDidDismiss((newPerson)=>{
      if(!newPerson) return;
      this.firebase.updatePerson(newPerson);
    })
  }


  getLang(str) {
    str = str.toLowerCase();
    if(str.includes('א') ||
      str.includes('ה') ||
      str.includes('ו') ||
      str.includes('י'))
      return Lang.he;
    else return Lang.en;
  }

  parseDate(str) {
    // get date as string and parse to Date form as should be in Item model
    if (!str) return;
    let splitBy;
    for (let i = 0; i < str.length; i++)
      if(isNaN(Number(str.charAt(i)))) {
        splitBy = str.charAt(i);
        break;
      }
    let ar = str.split(splitBy);
	if(!splitBy) ar = [1,1,str];
	if(ar[2].length == 2) {
	  let d = new Date();
	  if(ar[2] > d.getFullYear()-2000) ar[2] = '19'+ar[2];
	  else ar[2] = '20'+ar[2];
	}
    let d = new Date(Number(ar[2]), Number(ar[1]-1) || 0, Number(ar[0]) || 0, 12, 0, 0, splitBy ? 1 : 2);
    return d;
  }

    referLink(item) {
    if(!item.link)
      return;
		// try to find type of info:
		if(item.type.caption == InfoType.article.caption) item.type = this.getTypeFromUrl(item.link);
		// check if PDF:
		if(item.link.slice(-4) == '.pdf') {
		  item.type = InfoType.document;
		}
		// get info from youtube:
		if(item.link.indexOf('youtube.com/watch?') > -1 || item.link.indexOf('youtu.be/') > -1) {
      let id : string;
      if(item.link.indexOf('v=') > -1)
        id = item.link.slice(item.link.indexOf('v=')+2);
      else if(item.link.indexOf('.be/') > -1)
        id = item.link.slice(item.link.indexOf('.be/')+4);
      console.log(id);
      this.firebase.getYoutubeInfo(id).then(data => {
        if(item.type.caption != InfoType.podcast.caption) item.type = InfoType.video;
        let obj = data.json().items[0].snippet;
        item.title = obj.title;
        item.abstract = obj.description;
        item.dateOfCreation = new Date(obj.publishedAt);
        item.dateOfCreation.setMilliseconds(1);
        item.group.name = obj.channelTitle;
        item.keywords = obj.tags;
        //keywordsString = item.keywords.join(', ');
        console.log(obj);
      })
		}
		return item;
  }

  getTypeFromUrl (url) {
    if(!url) return InfoType.article;
    if(url.includes('youtu')) return InfoType.video;
    if(url.includes('soundcloud')) return InfoType.podcast;
    if(url.includes('facebook')) return InfoType.post;
    let source = clone(InfoType.article);
    source.color = null;
    if(url.includes('haaretz')) {source.icon = AIMG.haaretz; return source;}
    if(url.includes('israelhayom')) {source.icon = AIMG.israelhayom; return source;}
    if(url.includes('jpost')) {source.icon = AIMG.jpost; return source;}
    if(url.includes('maariv')) {source.icon = AIMG.maariv; return source;}
    if(url.includes('yediot')) {source.icon = AIMG.yediot; return source;}
    if(url.includes('mida')) {source.icon = AIMG.mida; return source;}
    if(url.includes('calcalist')) {source.icon = AIMG.calcalist; return source;}
    if(url.includes('nrg')) {source.icon = AIMG.nrg; return source;}
    if(url.includes('globes')) {source.icon = AIMG.globes; return source;}
    if(url.includes('inn')) {source.icon = AIMG.inn; return source;}
    if(url.includes('mako')) {source.icon = AIMG.mako; return source;}
    if(url.includes('themarker')) {source.icon = AIMG.themarker; return source;}
    return InfoType.article;
  }
}
