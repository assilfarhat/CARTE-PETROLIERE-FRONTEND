import { ServiceService } from './../../../services/service.service';
import { Component,OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from 'angular2-toaster';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-list-service',
  templateUrl: './list-service.component.html',
  styleUrls: ['./list-service.component.scss']
})
export class ListServiceComponent  implements OnInit {
  @ViewChild('deleteModal') deleteModal;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isLoading: boolean = false;
  dtOptions: any = {};
  dtTrigger = new Subject();
  services: any[];
  selectedService:any;
  constructor(private toasterService: ToasterService, private ServiceService : ServiceService) { }
  ngOnInit() {
    this.getListService();



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
          title: 'liste des Services '
        }
        ,
        {
          extend: 'excel',
          title: 'liste des Services '
        }

      ]
    };
  }
  
  getListService() {

    this.isLoading = true
    this.ServiceService.getAllServices()
      .subscribe((resp: any) => {
        this.reinitialiser()
        this.services = resp as []
        console.log(this.services)
        this.dtTrigger.next();
        this.isLoading = false;
      },
        (err) => {
          this.isLoading = false;

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

  selectService(id : any) {
    console.log("id from htlm",id)
    this.selectedService = this.services.find( u => u.idservice == id);
    console.log(" this.selectedRemise", this.selectedService)
  }

  delete(){
    console.log("delete",this.selectedService.idservice)
    this.ServiceService.deleteService(this.selectedService.idservice).subscribe(
      ()=>{

        this.services =this.services.filter(e=>(e.idservice != this.selectedService.idservice))
        this.toasterService.pop('success', '', 'Service  est supprimé avec succès')


        this.deleteModal.hide();
                   },
        (err) => {

          this.deleteModal.hide();
          this.toasterService.pop('error', '', 'Une erreur est survenue')        }

    )

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
