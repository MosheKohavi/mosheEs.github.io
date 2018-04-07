import { Component } from '@angular/core';
import {DataService} from "../../services/DataService";
import {InfoType, InfoTypeObj} from "../../models/infoType";

/**
 * Generated class for the CriteriaComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'criteria',
  templateUrl: 'criteria.html'
})
export class CriteriaComponent {

  types : InfoTypeObj[];

  constructor(private _ds : DataService) {
    this.types = this.getTypes();
  }

  getTypes() {
    // returns all InfoTypes as an array
    let arr = [];
    for (let i in InfoType) {
      arr.push(InfoType[i]);
    }
    return (arr);
  }

  clicked(myType : InfoTypeObj) {
    this._ds.filterType = myType;
    this._ds.onSearch();
  }
}
