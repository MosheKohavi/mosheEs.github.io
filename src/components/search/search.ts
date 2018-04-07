import { Component } from '@angular/core';
import {clone, DataService} from "../../services/DataService";

/**
 * Generated class for the SearchComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'search',
  templateUrl: 'search.html'
})

export class SearchComponent {

  constructor(private _ds : DataService) {

  }

  clearSearch() {
    this._ds.filterType = null;
    this._ds.filterKeys = [];
    this._ds.query = "";
    this._ds.onSearch();
    this._ds.shownPerson = null;
  }
  
  enterPressed(keyCode) {
	if(keyCode == 13 && this._ds.query) this._ds.onSearch();
  }
}
