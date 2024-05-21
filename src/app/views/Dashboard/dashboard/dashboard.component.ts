import { DashboardService } from './../../../services/dashboard.service';
import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';

import { ToasterService } from 'angular2-toaster';
import { AmountpipePipe } from 'app/pipes/amountpipe.pipe';
import { AmountmillierpipePipeVirgule } from 'app/pipes/amountmillierpipeVirgule.pipe';
import { Chart } from 'chart.js/auto';
import { ProgramFidaliteService } from 'app/services/program-fidalite.service';
import { Remise } from 'app/Model/Remise';
import { Subject, Subscription, interval } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ClientService } from 'app/services/client.service';
import { TokenService } from 'app/services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandePersService } from 'app/services/demande-pers.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css','../../../../assets/css/style.css']
})
export class DashboardComponent {
  @ViewChild('DemandeParseModal') DemandeParseModal;
  @ViewChild('AnnulerRechargeModal') AnnulerRechargeModal;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('deleteModal') deleteModal;
  motifAnnulation = ""
  selectedRemise:any;
  DemandePersList: any;
  DemandePerse: any;
  dtOptions: any = {};
  SelectedClient: string;
  DateDebut: string;
  dtTrigger = new Subject();
  demandePersCarte: any;
  nomPorteur :any;
  lang: any;
  ClientListDropdown: any = [];
  formSearch: FormGroup;
  idClientDrop: string = null;
  params: any;
  dateString: string;
  SelectedIdClient: string;
  SelectedNameClient: string;
  ListdetailCarte: any = [];
  DetailEnteteCarte: any = [];
  selectedFile: any;
  accessView:any;
  access:any;
  ValidationCarte:any;
  accessValidationCarte:any;


  ActualUser: string = "";


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
  constructor( private fb: FormBuilder, private route: ActivatedRoute, private demandePersService: DemandePersService, private toasterService: ToasterService, private router: Router, private tokenService: TokenService, private clientService: ClientService, private datePipe: DatePipe
     ,private programFidaliteService: ProgramFidaliteService,
     private DashboardService : DashboardService) {}

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
  this.updateSubscription = interval(10000).subscribe(
    (val) => { this.transactionstat() });
    this.createChart();
    this.ActualUser = this.tokenService.getRole();
    this.accessView = this.tokenService.getAccess();

  this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Validation Carte');
  //this.getlistacces();
  //const carteSubList =this.accessView.filter(item => item.idAccessView === 'Carte');
  this.ValidationCarte = this.access[0].action
  this.accessValidationCarte = this.access[0].valueAccessView
  //console.log("access",this.access);
  
  

    this.route.queryParams.subscribe((params) => {
      this.params = params
    });

    this.lang = this.tokenService.getLang();
    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      dom: 'flBrtip',
      language: {
        processing: "Traitement en cours...",
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable: "Aucune donn&eacute;e disponible dans le tableau",
        paginate: {
          first: "Premier",
          previous: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          last: "Dernier"
        },
        aria: {
          sortAscending: ": Activer pour trier la colonne par ordre croissant",
          sortDescending: ": Activer pour trier la colonne par ordre d&eacute;croissant"
        }
      },
      buttons: [
        {
          extend: 'print',
          title: 'liste des demandes Perso '
        },

        {
          extend: 'excel',
          title: 'liste des demandes Perso '
        }

      ]
    };
    this.chargerDemandePersList();
   
  }
  selectRemise(id : any) {
    console.log("id from htlm",id)
    console.log("ListRemise",this.ListRemise)
    this.selectedRemise = this.ListRemise.find( u => u.idRemise == id);
    console.log(" this.selectedRemise", this.selectedRemise)
  }
  delete(){
    console.log("delete",this.selectedRemise.idRemise)
    this.programFidaliteService.deleteRemise(this.selectedRemise.idRemise).subscribe(
      ()=>{

        this.ListRemise =this.ListRemise.filter(e=>(e.idRemise != this.selectedRemise.idRemise))
        this.toasterService.pop('success', '', 'Remise  est supprimé avec succès')

        // if(this.lang=='fr'){
        //   else{
        //     this.toasterService.pop('success', '', 'User deleted')
        //   }

        this.deleteModal.hide();
                   },
        (err) => {

          this.deleteModal.hide();
          this.toasterService.pop('error', '', 'Une erreur est survenue')        }

    )

  }
  chargerDemandePersList() {
    this.reinitialiser()
    this.DashboardService.senddemandePers().subscribe(
      res => {
        this.DemandePersList = res
        //console.log(" this.DemandePersList = res",this.DemandePersList)
        this.dtTrigger.next();
      }
    )
  }

  showValidateAnnulationModal() {
    this.DemandeParseModal.hide()
    this.motifAnnulation = ""
    this.AnnulerRechargeModal.show()
  }

 

  selectdemande(item) {

    this.DemandePerse = item
  }


  getCarteByDemande() {
    this.demandePersService.getCarteByDemande(this.DemandePerse.id).subscribe(
      res => {
        this.demandePersCarte = res as []
      this.nomPorteur = this.demandePersCarte.nomPrenom
        console.log("this.demandePersCarte",this.demandePersCarte)
        this.DemandeParseModal.show()
      }
    )
  }

  ConfrimerDemande() {
    this.demandePersService.ConfrimerDemande(this.DemandePerse.id).subscribe(
      res => {
        // Assuming res is the updated request object
        // Find the index of the confirmed request in the local list
        const index = this.DemandePersList.findIndex(demande => demande.id === this.DemandePerse.id);
  
        // Replace the confirmed request in the local list with the updated object
        if (index!== -1) {
          this.DemandePersList[index] = res;
        }
  
        // Optionally, refresh the DataTable instance to reflect the changes
        this.dtTrigger.next();
  
        this.toasterService.pop('success', '', 'Demande confirmée!');
      },
      err => {
        this.toasterService.pop('error', '', "Une erreur est survenue");
      }
    );
  }
  

  AnnulerDemande() {
    this.demandePersService.AnnulerDemande(this.DemandePerse.id).subscribe(
      res => {
        // Assuming res is the updated request object
        // Find the index of the rejected request in the local list
        const index = this.DemandePersList.findIndex(demande => demande.id === this.DemandePerse.id);
  
        // Remove the rejected request from the local list
        if (index!== -1) {
          this.DemandePersList.splice(index, 1);
        }
  
        // Optionally, refresh the DataTable instance to reflect the changes
        this.dtTrigger.next();
  
        this.toasterService.pop('error', '', 'Demande rejetée ');
      },
      err => {
        this.toasterService.pop('error', '', "Une erreur est survenue");
      }
    );
  }
  


  async reinitialiser() {
    if (this.dtElement) {
      let dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.rows().remove().draw();;
        dtInstance.destroy();
      }
    }
  }

  

  async downlaod(file) {

    this.selectedFile = file
    //console.log("this.selectedFile",this.selectedFile)
    var obj = {
      dateActivation: file.dateActivation,
      dateCreation: file.dateCreation,
      idClient : file.codeClient,
      numCarte: file.numCarte,
      raisonSociale : file.raisonSociale,
      typeCarte : file.typeCarte,
      dateValidation  : file.dateValidation,
      nomPrenom : file.nomPrenom,
      //dateUserDmdActivation
      createur : file.createur,
      validateur: file.validateur
      //userDmdActivation
      //userActivation

    }
 
    this.SelectedIdClient = obj.idClient;
    this.SelectedNameClient =obj.raisonSociale;

    //console.log("obj act", obj)
 
    //this.demandePersService.detail(obj.idClient,obj.dateCreation)

    //this.SelectedClient = this.formSearch.get('clientId').value;
    //this.DateDebut = this.formSearch.value.dateDebut.replace(/-/g, '');

    // if (this.SelectedClient == '' || this.SelectedClient == null) {
    //   this.toasterService.pop('error', '', 'Il faut choisir un client');
    // } else {
      //this.SelectedIdClient = this.SelectedClient.substring(0, this.SelectedClient.indexOf(" -"));
      //this.SelectedNameClient = this.SelectedClient.substring(this.SelectedClient.indexOf("- ") + 1, this.SelectedClient.length);
      
      this.demandePersService.detail(obj.idClient,obj.dateCreation).subscribe((resp: any) => {
        let res = resp.result;
        if (res.length == 0) {
          this.toasterService.pop('error', '', 'Rien à imprimer!!! Veuillez accepter au moins une demande.');
        } else {
          this.ListdetailCarte = resp.result;
          this.DetailEnteteCarte = resp.entete;
          //console.log("this.DetailEnteteCarte",this.DetailEnteteCarte)
          setTimeout(() => {
            this.printContact("iDdIV28")
          }, 500);
        }
      });
    //}
  }
  getMonthName(monthNumber: string): string {
    const monthNames = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
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
              label: "succès",
              data: this.successData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor : 'rgb(75, 192, 192)',
              borderWidth: 1
            },
            {
              label: "échec",
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
  printContact(cmpName: any) {
    var divToPrint = document.getElementById(cmpName);
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><style>table, th, td { border: 1px solid black;border-collapse: collapse; position:relative;border-collapse: collapse;table-layout: fixed; overflow: hidden; width: 100%}</style>')
    newWin.document.write('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
      this.ListdetailCarte = [];
      this.DetailEnteteCarte = [];
    }, 1000);
    newWin.onafterprint = function () {

    }
  }
}
