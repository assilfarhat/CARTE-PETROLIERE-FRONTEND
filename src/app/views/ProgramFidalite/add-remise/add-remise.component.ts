import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { ProgramFidaliteService } from 'app/services/program-fidalite.service';
import { DateMustBeLaterThanToday, montantRangeValidator } from 'app/shared/Validators'; // Adjust the import path as necessary

@Component({
  selector: 'app-add-remise',
  templateUrl: './add-remise.component.html',
  styleUrls: ['./add-remise.component.scss']
})
export class AddRemiseComponent implements OnInit {
 
  list : any[];
  model: any;
  Formremise: FormGroup;
  editMode=false; 
  mode:String;
  isloadingEditService=false;
  id:any;
  remise:any;
  constructor(private toasterService: ToasterService,
    private route: ActivatedRoute,
    private router: Router, private remiseService : ProgramFidaliteService ) { }

  ngOnInit(): void {

    this.remiseService.getAllRemises().subscribe(
      (data : any[])=>{
        this.list = data;
        this.id = this.route.snapshot.paramMap.get('id')
        console.log("id",this.id)
        if (this.id) {
   
          this.editMode = true;
          this.mode = "Update"
          
        } else {
          this.editMode = false;
          this.mode = "Add"
      }
      this.initForm()
     
      console.log("init",this.Formremise.value)
      })
   
 }

 private initForm() {
  // let idRemise = '';
  let tauxRemise = '';
  let montantMax = null;
  let montantMin = null;
  let dateExpiration = null;
  
 
  if(this.mode=='Update') {
     const e = this.list.find(u => u.idRemise == this.id)!
     console.log("remise",e)
    //  idRemise = e.idRemise
     tauxRemise = e.tauxRemise
     montantMax = e.montantMax
     montantMin = e.montantMin
     dateExpiration = e.dateExpiration
     
  }
  this.Formremise = new FormGroup({
    'tauxRemise': new FormControl(tauxRemise, Validators.required),
    'montantMax': new FormControl(montantMax, Validators.required),
    'montantMin': new FormControl(montantMin, Validators.required),
    'dateExpiration': new FormControl(dateExpiration, Validators.required),
 }, { validators: [montantRangeValidator(), DateMustBeLaterThanToday()] }
 ); // Apply the custom validator here

  console.log("form",this.Formremise.controls)
 }
 
  onSubmit() {
    console.log("add" ,this.Formremise.value )
    if(this.editMode)
    { 
      this.remiseService.updateRemise(this.id,this.Formremise.value).subscribe(
        ()=>{
          this.router.navigate(['/remise']);
          this.toasterService.pop('success', '', 'le remise a été modifié avec succès');

         } )
   }else {
    this.remiseService.addRemise(this.Formremise.value).subscribe(
      ()=>{ 
        this.router.navigate(['/remise']);
        this.toasterService.pop('success', '',  'le remise a été ajouté avec succès');
      }
    )
   
  }
}
}
