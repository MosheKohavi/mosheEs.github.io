import {Component, Input} from '@angular/core';
import {DataService} from "../../services/DataService";

/**
 * Generated class for the KeyComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'key',
  templateUrl: 'key.html'
})
export class KeyComponent {

  @Input() text: string;
  @Input() isSelected: boolean = false;
  @Input() last : boolean = true;

  constructor(private _ds : DataService) {

  }

  clicked() {
    if(this.isSelected) this._ds.removeFilter(this._ds.filterKeys.indexOf(this.text));
    else this._ds.addFilter(this.text);
  }

}
