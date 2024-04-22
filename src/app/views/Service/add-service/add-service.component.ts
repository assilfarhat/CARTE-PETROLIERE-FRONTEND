import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { ServiceService } from 'app/services/service.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
 
  list : any[];
  model: any;
  Formservice: FormGroup;
  editMode=false; 
  mode:String;
  isloadingEditService=false;
  id:any;
  service:any;
  constructor(private toasterService: ToasterService,
    private route: ActivatedRoute,
    private router: Router, private serService: ServiceService) { }


  ngOnInit(): void {
    this.serService.getAllServices().subscribe(
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
     
      console.log("init",this.Formservice.value)
      })
   
}

  

private initForm() {
  let idservice = '';
  let serviceName = '';
  let coefficient = null;
  let prix = null;
  let tauxTaxe = '';
 
  if(this.mode=='Update') {
     const e = this.list.find(u => u.idservice == this.id)!
     console.log("service",e)
     idservice = e.idservice
     serviceName = e.serviceName
     coefficient = e.coefficient
     prix = e.prix
     tauxTaxe = e.tauxTaxe
  }
  this.Formservice = new FormGroup({
     'idservice': new FormControl(idservice,Validators.required),
     'serviceName': new FormControl(serviceName, Validators.required), // Corrected form control name
     'coefficient': new FormControl(coefficient, Validators.required),
     'prix': new FormControl(prix, Validators.required),
     'tauxTaxe': new FormControl(tauxTaxe, Validators.required), // Corrected form control name
  })
  console.log("form",this.Formservice.controls)
 }
 
  onSubmit() {
    console.log(this.Formservice )
    if(this.editMode)
    { 
      this.serService.updateService(this.id,this.Formservice.value).subscribe(
        ()=>{
          this.router.navigate(['/service']);
          this.toasterService.pop('success', '', 'le service a été modifié avec succès');

         } )
   }else {
    this.serService.addService(this.Formservice.value).subscribe(
      ()=>{ 
        this.router.navigate(['/service']);
        this.toasterService.pop('success', '',  'le service a été ajouté avec succès');
      }
    )
   
  }
}

 
}

