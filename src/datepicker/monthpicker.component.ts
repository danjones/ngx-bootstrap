import { Component, OnInit, Input } from '@angular/core';

import { isBs3 } from '../utils/ng2-bootstrap-config';
import { DatePickerInnerComponent } from './datepicker-inner.component';

@Component({
  selector: 'monthpicker',
  template: `
<table *ngIf="datePicker.datepickerMode==='month'" role="grid">
  <thead>
    <tr>
      <th>
        <button type="button" class="btn btn-default btn-sm pull-left float-left"
                (click)="datePicker.move(-1)" [attr.tabindex]="tabIndex">
          <i class="glyphicon glyphicon-chevron-left"></i>
        </button></th>
      <th [attr.colspan]="((datePicker.monthColLimit - 2) <= 0) ? 1 : datePicker.monthColLimit - 2">
        <button [id]="datePicker.uniqueId + '-title'"
                type="button" class="btn btn-default btn-sm"
                (click)="datePicker.toggleMode()"
                [disabled]="datePicker.datepickerMode === maxMode"
                [ngClass]="{disabled: datePicker.datepickerMode === maxMode}" 
                [attr.tabindex]="tabIndex" style="width:100%;"
                [focus]="keyboardAccessible">
          <strong>{{title}}</strong>
        </button>
      </th>
      <th>
        <button type="button" class="btn btn-default btn-sm pull-right float-right"
                (click)="datePicker.move(1)" [attr.tabindex]="tabIndex">
          <i class="glyphicon glyphicon-chevron-right"></i>
        </button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let rowz of rows">
      <td *ngFor="let dtz of rowz" class="text-center" role="gridcell" id="{{dtz.uid}}" [ngClass]="dtz.customClass">
        <button type="button" style="min-width:100%;" class="btn btn-default"
                [ngClass]="{'btn-link': isBs4 && !dtz.selected && !datePicker.isActive(dtz), 'btn-info': dtz.selected || (isBs4 && !dtz.selected && datePicker.isActive(dtz)), disabled: dtz.disabled, active: !isBs4 && datePicker.isActive(dtz)}"
                [disabled]="dtz.disabled"
                (click)="datePicker.select(dtz.date)" [attr.tabindex]="tabIndex">
          <span [ngClass]="{'text-success': isBs4 && dtz.current, 'text-info': !isBs4 && dtz.current}">{{dtz.label}}</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>
  `,
  styles: [`
    :host .btn-info .text-success {
      color: #fff !important;
    }
  `]
})
export class MonthPickerComponent implements OnInit {
  @Input() public keyboardAccessible: boolean = false;
  public title:string;
  public rows:any[] = [];
  public datePicker:DatePickerInnerComponent;
  public maxMode:string;

  public constructor(datePicker:DatePickerInnerComponent) {
    this.datePicker = datePicker;
  }

  public get isBs4():boolean {
    return !isBs3();
  }
    
  public get tabIndex(): number {
    return this.keyboardAccessible ? 0 : -1;
  }

  public ngOnInit():void {
    let self = this;

    this.datePicker.stepMonth = {years: 1};

    this.datePicker.setRefreshViewHandler(function ():void {
      let months:any[] = new Array(12);
      let year:number = this.activeDate.getFullYear();
      let date:Date;

      for (let i = 0; i < 12; i++) {
        date = new Date(year, i, 1);
        date = this.fixTimeZone(date);
        months[i] = this.createDateObject(date, this.formatMonth);
        months[i].uid = this.uniqueId + '-' + i;
      }

      self.title = this.dateFilter(this.activeDate, this.formatMonthTitle);
      self.rows = this.split(months, self.datePicker.monthColLimit);
    }, 'month');

    this.datePicker.setCompareHandler(function (date1:Date, date2:Date):number {
      let d1 = new Date(date1.getFullYear(), date1.getMonth());
      let d2 = new Date(date2.getFullYear(), date2.getMonth());
      return d1.getTime() - d2.getTime();
    }, 'month');

    this.datePicker.refreshView();
  }

  // todo: key events implementation
}
