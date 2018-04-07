import {Lang} from "./LangEnum";
import {InfoTypeObj} from "./infoType";
import {Person} from "./Person";

export class Item {
  firebaseKey? : string;
  title : string;
  author : Person;
  group? : Person;
  type : InfoTypeObj;
  topic? : string;
  abstract? : string;
  keywords? : string[];
  image? : string;
  link? : string;
  language : Lang;
  dateOfCreation? : Date;
  timeOfUpdate? : Date[];
  editedBy? : string[];
  recommended? : boolean;
  hidden? : boolean;

  fullView? : boolean = false;
}
