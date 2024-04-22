import { DataTableModule } from 'angular2-datatable';
import { Component,OnInit,ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ProgramFidaliteService } from 'app/services/program-fidalite.service';
import { DataTableDirective ,DataTablesModule} from 'angular-datatables';
import { ToasterService } from 'angular2-toaster';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-remise',
  templateUrl: './remise.component.html',
  styleUrls: ['./remise.component.scss']
})
export class RemiseComponent  implements OnInit  {
  @ViewChild('deleteModal') deleteModal;
  @ViewChild(DataTableDirective, { static: false })

  dtElement: DataTableDirective;
  isLoading: boolean = false;
  dtOptions: any = {};
  dtTrigger = new Subject();
  remises: any[];
  firstRemise: any;
  selectedRemise:any;
 

  constructor(private toasterService: ToasterService, private programFidaliteService: ProgramFidaliteService) { }
  ngOnInit() {
    this.getListRemise();



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
          title: 'liste des Remises '
        }
        ,
        {
          extend: 'excel',
          title: 'liste des Remises '
        }

      ]
    };
  }
  
  getListRemise() {

    this.isLoading = true
    this.programFidaliteService.getAllRemises()
      .subscribe((resp: any) => {
        this.reinitialiser()
        this.remises = resp as []
        console.log(this.remises)
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
  selectRemise(id : any) {
    console.log("id from htlm",id)
    this.selectedRemise = this.remises.find( u => u.idRemise == id);
    console.log(" this.selectedRemise", this.selectedRemise)
  }

  delete(){
    console.log("delete",this.selectedRemise.idRemise)
    this.programFidaliteService.deleteRemise(this.selectedRemise.idRemise).subscribe(
      ()=>{

        this.remises =this.remises.filter(e=>(e.idRemise != this.selectedRemise.idRemise))
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
