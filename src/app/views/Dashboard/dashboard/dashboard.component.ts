import { DashboardService } from './../../../services/dashboard.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as L from 'leaflet';
import { ToasterService } from 'angular2-toaster';
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
export class DashboardComponent implements OnInit, AfterViewInit {
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
  idClientDrop: string = "";
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
  //address: string;
  name: string;
  lat: any;
  long: any;

  private map:L.Map;
  private markers: L.Marker[];

  // private initMap(): void {
  //   const baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  //   });

  //   this.map = L.map('map', {
  //     center: [26.0198, 32.2778],
  //     zoom: 4,
  //     layers: [baseLayer]
  //   });

  //   const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 18,
  //     minZoom: 3,
  //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  //   });
  //   tiles.addTo(this.map);

  //   const coordinates = [
  //     [37.22870276506414, 10.131190785320287],
  //     [37.23213435351902, 9.939532133207376],
  //     // Add all other coordinates here
  //     //...
  //   ];

  //   this.markers = coordinates.map(([lat, lng]) => {
  //     const marker = L.marker([lat, lng]).addTo(this.map);
  //     marker.bindPopup('<b>Loading...</b>');
  //     return marker;
  //   });
  // }
  private initMap(): void {


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = position.coords;
          this.lat = coords.latitude;
          this.long = coords.longitude;
          this.name = '';


          this.map = L.map('map').setView([coords.latitude, coords.longitude], 10);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(this.map);

         // this.reverseGeocode(coords.latitude, coords.longitude);
          this.setupMarkersAndBindPopups();
          //this.setupPolygon();
            },
        (error) => {
          console.error('Error while locating position:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by your browser.');
    }
  }

  
  private setupMarkersAndBindPopups(): void {
    const coordinates = [
      [36.81546030396784, 10.184293337364334],
      [37.22870276506414, 10.131190785320287],
      [37.23213435351902, 9.939532133207376],
      [37.21614666320535, 10.129924242025073],
      [37.06064644541785, 9.654428404701354],
      [36.97870712183035, 9.305500925067628],
      [36.751548297349466, 9.20287516504702],
      [36.68985281684334, 9.449176945150572],
      [36.67476416346666, 9.59114253735449],
      [36.780322561430395, 10.030722776827867],
      [36.82688656479441, 10.10940250262763],
      [36.867948932084886, 10.165846653744849],
      [36.84468296490448, 10.172688369031786],
      [36.81045544376009, 10.189792657249125],
      [36.867948932084886, 10.270182811870619],
      [36.873422248001226, 10.324916534166107],
      [36.818671445211535, 10.275314098335823],
      [36.7296178067155, 10.234263806614207],
      [36.7611409199767, 10.297549673018363],
      [36.743325099183636, 10.336889535918246],
      [36.61300704271136, 10.509642846913374],
      [36.61920893974313, 10.504143345039695],
      [36.78537506975044, 10.622118694624241],
      [36.75472528972442, 10.79429892900137],
      [36.78282138940334, 10.874012000472263],
      [36.75727990600724, 10.905897229060622],
      [36.702558568130726, 10.834717364460001],
      [36.425200623514876, 10.54021766859858],
      [36.26008645313196, 10.203453653860604],
      [36.4330544543696, 10.57438211526754],
      [36.1478454611548, 10.076557072701835],
      [35.96239503675783, 10.301066405623624],
      [35.98609388495654, 10.532896695053733],
      [35.90707006143862, 10.518254782037094],
      [35.86357328178327, 10.632949767334093],
      [35.75076600263206, 10.571941796431435],
      [35.72699669136022, 10.818413998878182],
      [35.75076600263206, 10.1009602610629],
      [35.60407560220121, 9.78859945004128],
      [35.57033837677239, 10.859899443525952],
      [35.655646188929765, 10.989236341839588],
      [35.657629008868696, 10.769607646590016],
      [35.06657266115639, 10.874541356542593],
      [34.85858266300544, 10.718360951031784],
      [35.25211603535977, 10.210774633121655],
      [34.61793914050589, 10.596345001156529],
      [34.778446037506335, 10.110721517129145],
      [34.906627195750175, 9.810562300288058],
      [35.088540707038284, 9.664143170121674],
      [34.900623165000425, 9.144355245029443],
      [35.31785220314607, 9.422551592345572],
      [35.86622387129464, 9.186502136957651],
      [36.24894886595112, 8.837536543394439],
      [36.42194158431674, 9.249950426696419],
      [33.534312006217654, 9.056197644100981],
      [34.0662235391991, 8.202725126459088],
      [33.74596329298138, 9.019879664626858],
      [33.928215272537855, 10.073629730575234],
      [34.012494376733734, 9.952780780126750788]
    ];
  
    this.markers = coordinates.map(([lat, lng]) => {
      const marker = L.marker([lat, lng]).addTo(this.map);
  
      // Perform reverse geocoding to get the address
      this.reverseGeocode(lat, lng).then(address => {
        console.log("Address:", address); // Log the address
        marker.bindPopup(address); // Bind the address to the marker's popup
      }).catch(error => {
        console.error('Error fetching address:', error);
        // Optionally, handle the case where the address couldn't be fetched
      });
  
      return marker;
    });
  }
  
  private reverseGeocode(lat: number, lng: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const apiKey = '7f7925e686674647a7889e58262b244e'; // Make sure to replace YOUR_API_KEY with your actual Geoapify API key
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;
  
      fetch(url)
      .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
      .then(data => {
          if (data && data.features && data.features.length > 0) {
            const displayName = data.features[0].properties.formatted;
            resolve(displayName || 'Unknown Address');
            console.log("display_name:", displayName);
          } else {
            reject(new Error('No address found'));
          }
        })
      .catch(error => {
          console.error('Error fetching address:', error);
          reject(error);
        });
    });
  }
  
  

  // private reverseGeocode(lat: number, lng: number): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     $.getJSON(`https://nominatim.openstreetmap.org/reverse?format=geojson&lat=44.50155&lon=11.33989`, function(data) {
  //       resolve(data || 'Unknown Address'); 
  //       console.log("display_name:", data);
  //     }, function(error) {
  //       reject(error);
  //     });
  //   });
  // }

  markerClickHandler(marker: L.Marker): void {
    this.reverseGeocode(marker.getLatLng().lat, marker.getLatLng().lng).then(address => {
      marker.unbindPopup(); // Remove initial popup
      marker.bindPopup(`<b>${address}</b>`); // Bind the address to the marker
      marker.openPopup(); // Open the popup to show the address
    }).catch(error => {
      console.error('Error fetching address :', error);
    });
  }
  

  
  constructor( private fb: FormBuilder, private route: ActivatedRoute, private demandePersService: DemandePersService, private toasterService: ToasterService, private router: Router, private tokenService: TokenService, private clientService: ClientService, private datePipe: DatePipe
     ,private programFidaliteService: ProgramFidaliteService,
     private DashboardService : DashboardService) {}
     
     
    ngAfterViewInit(): void {
      this.initMap();
    }
    
  async ngOnInit(){

    this.updateSubscription = interval(900000).subscribe(
      (val) => { this.transactionstat() });
      this.createChart();
    this.chargerClientListDropdown();
    this.formSearch = this.fb.group({
      clientId: [this.idClientDrop],
     
    });
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

  chargerClientListDropdown() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientListDropdown = res as [];
      }
    )
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
    let search = null
    this.DashboardService.cardscount(search).subscribe(res =>{
      this.data  = res;
     // console.log("resultat",res)
      this.activecards = this.data.activeCount;
      this.blockedcards = this.data.blockedCount;
      
      
    });
    this.formSearch.controls['clientId'].valueChanges.subscribe(selectedClientId => {
      console.log("selectedClientId",selectedClientId)
      if(selectedClientId){
        const splitString = selectedClientId.split(' - ');
        console.log("splitString[0]",splitString[0])
        this.DashboardService.cardscount(splitString[0]).subscribe(res =>{
          this.data  = res;
         // console.log("resultat",res)
          this.activecards = this.data.activeCount;
          this.blockedcards = this.data.blockedCount;
          
          
        });
      }else{
        let search = null
        this.DashboardService.cardscount(search).subscribe(res =>{
          this.data  = res;
         // console.log("resultat",res)
          this.activecards = this.data.activeCount;
          this.blockedcards = this.data.blockedCount;
          
          
        });
      }
      
    })
 
    
  }
  rechargescount(){
    let search = null
    this.DashboardService.rechagecount(search).subscribe(res =>{
      this.data = res
     // console.log("rechargetscount",res)
      this.rechargeconfirme = this.data.rechargeconfirme;
      this.rechargeannule = this.data.rechargeannule;
      
      
      
    });
    this.formSearch.controls['clientId'].valueChanges.subscribe(selectedClientId => {
      console.log("selectedClientId",selectedClientId)
      if(selectedClientId){
        const splitString = selectedClientId.split(' - ');
        console.log("splitString[0]",splitString[0])
        this.DashboardService.rechagecount(splitString[0]).subscribe(res =>{
          this.data = res
         // console.log("rechargetscount",res)
          this.rechargeconfirme = this.data.rechargeconfirme;
          this.rechargeannule = this.data.rechargeannule;
          
          
          
        });
      }else{
        let search = null
        this.DashboardService.rechagecount(search).subscribe(res =>{
          this.data = res
         // console.log("rechargetscount",res)
          this.rechargeconfirme = this.data.rechargeconfirme;
          this.rechargeannule = this.data.rechargeannule;
          
          
          
        });
      }
      
    })
 
   
  }

  getListRemise() {
    this.programFidaliteService.getAllRemises()
      .subscribe((resp: any) => {
       
        this.ListRemise = resp as []
        //console.log("programFidaliteService:",this.ListRemise)
     
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
