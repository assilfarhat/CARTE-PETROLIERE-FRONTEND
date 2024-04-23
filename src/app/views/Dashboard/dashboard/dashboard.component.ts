import { DashboardService } from './../../../services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { SuiviTransactionsService } from 'app/services/suivi-transactions.service';
import { ToasterService } from 'angular2-toaster';
import { AmountpipePipe } from 'app/pipes/amountpipe.pipe';
import { AmountmillierpipePipeVirgule } from 'app/pipes/amountmillierpipeVirgule.pipe';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 1, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 1 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );
  cards2 = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );
 
  stat : any = [];
  constructor(private breakpointObserver: BreakpointObserver,
     private datePipe: DatePipe, private toasterService: ToasterService, private amountpipePipe: AmountpipePipe, 
     private DashboardService : DashboardService,private amountmillierpipeVirgule: AmountmillierpipePipeVirgule) {}

  ngOnInit(){
   
    this.getTransactionStat();
  }
   
   getTransactionStat(){
    this.DashboardService.transactionstat().subscribe(res =>{
    
      this.stat = res ;
      console.log("stat",this.stat)
    })
   }


}
