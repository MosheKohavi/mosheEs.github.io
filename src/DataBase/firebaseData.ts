import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import * as firebase from 'firebase/app';
import {Observable} from "rxjs/Observable";
import {Item} from "../models/Item";
import {clone, DataService, NO_IMG} from "../services/DataService";
import {Lang} from "../models/LangEnum";
import {InfoType} from "../models/infoType";
import {AlertController, Events, LoadingController} from "ionic-angular";
import {Person} from "../models/Person";
import {Http, Jsonp} from "@angular/http";
import 'rxjs/add/operator/toPromise';

const youTubeAPIKey = 'AIzaSyAdeseDX0E49ojQaVzUSLbha2dsJqr7gL8';

export const firebaseConfig = {
 <HIDDEN>
};

@Injectable()

export class FirebaseData {

  itemsServer : FirebaseListObservable<any>;
  authorsServer : FirebaseListObservable<any>;
  trashServer : FirebaseListObservable<any>;
  historyServer : FirebaseListObservable<any>;

  currentUser;
  userName;

  items;
  authors;
  trash;
  history;

  loader;
  loadings : number = 0;

  subscriptionsCheck : boolean[] = [];
  dataWasSent : boolean = false;

  constructor(dataBase: AngularFireDatabase,
              private _ds : DataService,
              private jsonp : Jsonp,
              private http : Http,
              public loadingCtrl: LoadingController,
              public alertCtrl : AlertController,
              public events : Events,
  )
  {

    firebase.initializeApp(firebaseConfig);
    this.itemsServer = dataBase.list('/items');
    this.authorsServer = dataBase.list('/persons');
    this.trashServer = dataBase.list('/trash');
    this.historyServer = dataBase.list('/history');
    this.connectToServer();

  }

  startLoader(txt? : string) {
    if(this.loadings == 0) {
      this.loader = this.loadingCtrl.create({content: txt});
      this.loader.present();
    }
    this.loadings++;
  }

  endLoader() {
    this.loadings--;
    if(this.loadings == 0)
      this.loader.dismiss();
  }

  connectToServer() {

    this.startLoader('Wait for server...');

    // Initiate subscriptions to all objects in the server:
    // 0: list of items:
    this.itemsServer.subscribe((itemsListFromServer) => {
      if(this._ds.viewTrash) return;
      this.items = itemsListFromServer;
      this._ds.items = [];
      for (let i = 0; i < this.items.length; i++)
        this._ds.items[i] = JSON.parse(this.items[i].$value);
      this._ds.viewTrash = false;
      this.subscriptionComplete(0);
    });
    // 1: list of authors:
    this.authorsServer.subscribe((authorsListFromServer) => {
      this.authors = authorsListFromServer;
      this._ds.authorList = [];
      for (let i = 0; i < this.authors.length; i++)
        this._ds.authorList[i] = JSON.parse(this.authors[i].$value);
      this.subscriptionComplete(1);
    });
    // 2: list of deleted items:
    this.trashServer.subscribe((trashListFromServer) => {
      this.trash = trashListFromServer;
      this._ds.trashList = [];
      for (let i = 0; i < this.trash.length; i++)
        this._ds.trashList[i] = JSON.parse(this.trash[i].$value);
      this.subscriptionComplete(2);
    });
    // 3: list of history log:
    this.historyServer.subscribe((historyListFromServer) => {
      this.history = historyListFromServer;
      this.subscriptionComplete(3);
    });
    // Subscribes whether allowed user is signed in or not:
    firebase.auth().onAuthStateChanged((user) => {
        this._ds.EDITOR_MODE = !!user;
        this.currentUser = firebase.auth().currentUser;
        this.userName = '@' + this.currentUser.email.slice(0,this.currentUser.email.indexOf('@'));
        // alert('שלום ' + this.userName + ', נכנסת בהצלחה למצב עריכה.');
    });
  }

  subscriptionComplete(index : number) {
    const totalSubscriptions = 4;
    // when all subscriptions have completed, send info from server to data service
    if(this.dataWasSent) return;
    this.subscriptionsCheck[index] = true;
    console.log(`subscription no. ${index} out of ${totalSubscriptions} - V`);
    for(let i = 0; i < totalSubscriptions; i++)
      if(!this.subscriptionsCheck[i])
        return;

    this.dataWasSent = true;
    this.endLoader();
    console.log('Server has loaded');

	this.manualChangingsInDataBase();

	if(this._ds.filterKeys.length)
		this._ds.onSearch();
	else
		this._ds.showAtStart();
  }

  refreshConnection() {
    this.subscriptionsCheck = [];
    this.dataWasSent = false;
    this.connectToServer();
  }

  editorSignIn(email,password) {
    this.startLoader('מתחבר למשתמש...');
    if(email.indexOf('@') == -1)
      email += '@gmail.com';          //(Gmail users can sign in with user name only)
    firebase.auth().signInWithEmailAndPassword(email,password)
      .then(()=>{
        this.endLoader();
        // already calls the function "firebase.auth().onAuthStateChanged(user)" above.
      })
      .catch((error)=>{
        this.endLoader();
        alert(error.message);
      })
  }

  editorSignOut() {
    this.startLoader('יוצא...');
    firebase.auth().signOut().then(()=>{
      this.endLoader();
      alert('יציאה ממצב עריכה');
    })
  }

  addItemToServer(items : Item[]) {
    this.startLoader();
    let success : string[] = [];
    let failed : string[] = [];
    for (let i = 0; i < items.length; i++) {
      // push an object to server and get its key:
      let newKey = firebase.database().ref('/items').push().key;
      // enter this given key to the item:
      items[i].firebaseKey = newKey;
      //stamp item:
      this.stampItem(items[i]);
      // enter the item to the server on the key place (as a JSON):
      let newItem = {};
      newItem[newKey] = JSON.stringify(items[i]);
      firebase.database().ref('/items').update(newItem)
        .then(()=>{
          success.push(items[i].title);
          if (i == items.length - 1) {
            sendReport(success,failed);
            this.events.publish('AllItemsUploaded');
            this.endLoader();
          }
        })
        .catch(()=>{
          failed.push(items[i].title);
          if (i == items.length - 1) {
            sendReport(success,failed);
            this.endLoader();
          }
        })
    }
    function sendReport(success,failed) {
      let str : string;
      str = `${failed.length ? '' : 'All'} ${success.length} items were successfully uploaded to server: \n` + `------------------------------------------------- \n`;
      for (let i = 0; i < success.length; i++)
        str += `* ${success[i]}, \n`;
      if(failed.length) str += `${failed.length} items failed: \n` + `--------------------------- \n`;
      for (let i = 0; i < failed.length; i++)
        str += `* ${failed[i]}, \n`;
      alert(str);
    }
  }

  updateItem(updatedItem : Item, noAlert? : boolean) {
    this.startLoader();
    this.stampItem(updatedItem);
    let newItem = {};
    newItem[updatedItem.firebaseKey] = JSON.stringify(updatedItem);
    firebase.database().ref('/items').update(newItem)
      .then(()=>{
        this.endLoader();
        if (!noAlert) alert('פריט עודכן בהצלחה');
      })
      .catch(()=>{
        this.endLoader();
        alert('עדכון פריט נכשל');
      })
  }

  addPersonToServer(person : Person) {
    this.startLoader();
    // push an object to server and get its key:
    let newKey = firebase.database().ref('/persons').push().key;
    // enter this given key to the author:
    person.firebaseKey = newKey;
    //stamp person:
    this.stampItem(person);
    // enter the author to the server on the key place (as a JSON):
    let newPerson = {};
    newPerson[newKey] = JSON.stringify(person);
    firebase.database().ref('/persons').update(newPerson)
      .then(()=>{
        this.endLoader();
        alert('מחבר נשמר בהצלחה');
      })
      .catch(()=>{
        this.endLoader();
        alert('שמירת מחבר חדש נכשלה');
      })
  }

  updatePerson(updatedPerson : Person) {
    this.startLoader();
    this.stampItem(updatedPerson);
    let newPerson = {};
    newPerson[updatedPerson.firebaseKey] = JSON.stringify(updatedPerson);
    firebase.database().ref('/persons').update(newPerson)
      .then(()=>{
        this.endLoader();
        alert('פרטי מחבר עודכנו בהצלחה');
        this.updatePersonInAllItems(updatedPerson);
      })
      .catch(()=>{
        this.endLoader();
        alert('עדכון פרטי מחבר נכשל');
      })
  }

  updatePersonInAllItems(person : Person) {
    // when changing person details, update all items that linked to this person
    for (let i = 0; i < this._ds.items.length; i++) {
      if(this._ds.items[i].author.firebaseKey == person.firebaseKey) {
        this._ds.items[i].author = person;
        this.updateItem(this._ds.items[i], true);
      }
      if(this._ds.items[i].group.firebaseKey == person.firebaseKey) {
        this._ds.items[i].group = person;
        this.updateItem(this._ds.items[i], true);
      }
    }
  }

  deletePerson(person : Person) {
    let query = this.alertCtrl.create({
      title : 'האם למחוק פרטי מחבר זה?',
      buttons : [
        {
          text : 'כן',
          handler : ()=> {this.yesDeletePerson(person)}
        },
        {
          text : 'לא',
          role : 'cancel'
        }
      ]
    });
    query.present();
  }
  yesDeletePerson(person : Person) {
    let clearedPerson : Person;
    clearedPerson = {
      name: person.name,
      firebaseKey: person.firebaseKey,
      img: NO_IMG
    };
    this.updatePerson(clearedPerson);
    this.updatePersonInAllItems(clearedPerson);
    alert(person.name + ' נמחק');
  }

  stampItem (item) {
    // 1) add user name to contributors list:
    if(!item.editedBy) item.editedBy = [];
    item.editedBy.push(this.userName);
    console.log(item.editedBy);
    // 2) add time stamp:
    let timeOfUpdate = new Date(Date.now());
    if(!item.timeOfUpdate) item.timeOfUpdate = [];
	  item.timeOfUpdate.push(timeOfUpdate);
    // 3) report to history log:
    let str : string = `${timeOfUpdate.toLocaleDateString()}: "${item.title || item.name}" ${item.editedBy.length == 1 ? 'נוצר ע"י' : 'עודכן ע"י'} ${this.userName}`;
    firebase.database().ref('/history').push(str);
  }

  moveToTrash(item : Item) {
    let query = this.alertCtrl.create({
      title : 'האם למחוק פריט זה?',
      buttons : [
        {
          text : 'כן',
          handler : () => {
            this.yesDeleteItem(item);
            this._ds.onSearch();
          }
        },
        {
          text : 'לא',
          role : 'cancel',
        }
      ]
    });
    query.present();
  }
  yesDeleteItem(item : Item) {
    this.startLoader();
    let oldKey = item.firebaseKey;
    // push an object to server (trash folder) and get its key:
    let newKey = firebase.database().ref('/trash').push().key;
    // enter this given key to the item:
    item.firebaseKey = newKey;
    // enter the item to the server on the key place (as a JSON):
    let newItem = {};
    newItem[newKey] = JSON.stringify(item);
    firebase.database().ref('/trash').update(newItem)
      .then(()=>{
        // removes the item from items folder on server:
        firebase.database().ref('/items/' + oldKey).remove()
          .then(()=>{
            let d = new Date();
            firebase.database().ref('/history').push(`${d.toLocaleDateString()}: "${item.title}" הועבר לסל המיחזור ע"י ${this.userName}.`);
            this.endLoader();
            alert('הפריט נמחק בהצלחה והועבר לסל המיחזור');
            this._ds.onSearch();
          });
      })
  }

  moveFromTrash(item : Item) {
    this.startLoader();
    let oldKey = item.firebaseKey;
    let newKey = firebase.database().ref('/items').push().key;
    item.firebaseKey = newKey;
    let newItem = {};
    newItem[newKey] = JSON.stringify(item);
    firebase.database().ref('/items').update(newItem)
      .then(()=>{
        firebase.database().ref('/trash/' + oldKey).remove()
          .then(()=>{
            this.endLoader();
            let d = new Date();
            firebase.database().ref('/history').push(`${d.toLocaleDateString()}: "${item.title}" הוצא מסל המיחזור ע"י ${this.userName}.`);
            alert('הפריט הועבר בהצלחה חזרה מתוך סל המיחזור');
            this._ds.viewTrash = false;
            this.refreshConnection();
          });
      })
  }

  deleteItem(item : Item) {
    // NOT IN USE
    firebase.database().ref('/items/' + item.firebaseKey).remove();
  }

  testSecurityAccess() {
    firebase.database().ref('/items').push('hello').then(()=>alert('success')).catch(()=>alert('Failed'));
  }

  getYoutubeInfo(id : string) {
    let url = `https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${id}&key=${youTubeAPIKey}`;
    return this.http.get(url).toPromise();
  }

  manualChangingsInDataBase() {
    // Do something in data base (for me)
  }

}
