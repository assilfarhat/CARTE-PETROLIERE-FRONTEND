import { DashboardService } from './../../../services/dashboard.service';
import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';

import { ToasterService } from 'angular2-toaster';
import { AmountpipePipe } from 'app/pipes/amountpipe.pipe';
import { AmountmillierpipePipeVirgule } from 'app/pipes/amountmillierpipeVirgule.pipe';
import { Chart } from 'chart.js/auto';
import { ProgramFidaliteService } from 'app/services/program-fidalite.service';
import { Remise } from 'app/Model/Remise';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css','../../../../assets/css/style.css']
})
export class DashboardComponent {
 
  // cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
  //   map(({ matches }) => {
  //     if (matches) {
  //       return [
  //         { title: 'Card 1', cols: 1, rows: 1 },
  //         { title: 'Card 2', cols: 1, rows: 1 },
  //         { title: 'Card 3', cols: 1, rows: 1 },
  //         { title: 'Card 4', cols: 1, rows: 1 }
  //       ];
  //     }

  //     return [
  //       { title: 'Card 1', cols: 1, rows: 1 },
  //       { title: 'Card 2', cols: 1, rows: 1 },
  //       { title: 'Card 3', cols: 1, rows: 1 },
  //       { title: 'Card 4', cols: 1, rows: 1 }
  //     ];
  //   })
  // );
  // cards2 = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
  //   map(({ matches }) => {
  //     if (matches) {
  //       return [
  //         { title: 'Card 1', cols: 1, rows: 1 },
         
  //       ];
  //     }

  //     return [
  //       { title: 'Card 1', cols: 2, rows: 1 },
       
  //     ];
  //   })
  // );
  public chart: any;
  stat : any = [];
  cards: any = []; 
  activecards: any =[];
  rechargeconfirme: any =[];
  rechargeannule: any =[];
  blockedcards: any = [] ;
  data : any = [];
  months : any =[];
  successData : any =[];
  failData : any =[];
  ListRemise : Remise[] = [];
  updateSubscription: Subscription;
  constructor(private breakpointObserver: BreakpointObserver,
     private datePipe: DatePipe, private toasterService: ToasterService, private amountpipePipe: AmountpipePipe, 
     private programFidaliteService: ProgramFidaliteService,
     private DashboardService : DashboardService,private amountmillierpipeVirgule: AmountmillierpipePipeVirgule) {}

  async ngOnInit(){
    this.cardscount();
    this.rechargescount();

    this.DashboardService.cardStatusUpdate.subscribe(({ activeCount, blockedCount }) => {
      // Update your component's state with the new counts
     
      this.activecards = activeCount;
      this.blockedcards = blockedCount;

     // console.log(`dash Active Cards : ${this.activecards}, dash Blocked Cards: ${  this.blockedcards}`);
    });
    this.DashboardService.rechargeUpdate.subscribe(({rechargeconfirme,rechargeannule}) => {
      this.rechargeconfirme = rechargeconfirme;
      this.rechargeannule = rechargeannule;
    //  console.log(`rechargecount : ${this.rechargeconfirme}`);
    });
    this.getListRemise();
    // In your component
    this.DashboardService.remiseUpdate.subscribe((data: { remises: Remise[] }) => {
    // Directly use the remises data
    console.log("1",typeof data);
    console.log("2",typeof data.remises);
    this.ListRemise = data.remises;
    console.log(`ListRemise comp: :  ${JSON.stringify(this.ListRemise)}`);
  });
  this.updateSubscription = interval(5000).subscribe(
    (val) => { this.transactionstat() });
    this.createChart();
  }

  
  getMonthName(monthNumber: string): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const monthIndex = parseInt(monthNumber, 10) - 1;
    return monthNames[monthIndex];
  }
  transactionstat(){
    this.DashboardService.transactionstat().subscribe(res => {

      this.stat = res;
      //console.log("stat interval:", this.stat.resultByMonth);
      this.months = this.stat.resultByMonth.map(item => this.getMonthName(item.month));
      this.successData = this.stat.resultByMonth.map(item => item.nbrSucess);
      this.failData = this.stat.resultByMonth.map(item => item.nbrFail);
      if (this.chart) {
        this.chart.data.labels = this.months;
        this.chart.data.datasets[0].data = this.successData;
        this.chart.data.datasets[1].data = this.failData;
        this.chart.update();
      }
       
      });
  
   
  }
  createChart(){
    
   this.DashboardService.transactionstat().subscribe(res => {

      this.stat = res;
   //  console.log("stat", this.stat.resultByMonth);
      this.months = this.stat.resultByMonth.map(item => this.getMonthName(item.month));
      this.successData = this.stat.resultByMonth.map(item => item.nbrSucess);
      this.failData = this.stat.resultByMonth.map(item => item.nbrFail);
   //   console.log("months1",this.months)
      let delayed;
      this.chart = new Chart("MyChart", {
        type: 'bar',
        data: {
          labels: this.months,
          datasets: [
            {
              label: "Success",
              data: this.successData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor : 'rgb(75, 192, 192)',
              borderWidth: 1
            },
            {
              label: "Fail",
              data: this.failData,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor : 'rgb(255, 99, 132)',
              borderWidth: 1
            }  
          ]
        },
        options: {
          // animation: {
          //   onComplete: () => {
          //     delayed = true;
          //   },
          //   delay: (context) => {
          //     let delay = 0;
          //     if (context.type === 'data' && context.mode === 'default' && !delayed) {
          //       delay = context.dataIndex * 300 + context.datasetIndex * 100;
          //     }
          //     return delay;
          //   },
          // },
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 2.5,
          
        }
      });
   })
   
  
  }
  
  cardscount(){
  this.DashboardService.cardscount().subscribe(res =>{
    this.data  = res;
   // console.log("resultat",res)
    this.activecards = this.data.activeCount;
    this.blockedcards = this.data.blockedCount;
    
    
  });
  }
  rechargescount(){
    this.DashboardService.rechagecount().subscribe(res =>{
      this.data = res
     // console.log("rechargetscount",res)
      this.rechargeconfirme = this.data.rechargeconfirme;
      this.rechargeannule = this.data.rechargeannule;
      
      
      
    });
  }

  getListRemise() {
    this.programFidaliteService.getAllRemises()
      .subscribe((resp: any) => {
       
        this.ListRemise = resp as []
        console.log("programFidaliteService:",this.ListRemise)
     
      },
        (err) => {
         

        }
      );
  }
}
