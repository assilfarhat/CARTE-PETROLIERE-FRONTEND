//import { LocalStorage } from '@ng-idle/core';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TokenService } from 'app/services/token.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  form: FormGroup;
  hasError = false;
  errorMessage: string;
  submitted = false;
  lang='fr';
  user: any;
  isModalOpen = false; // Utilisée pour afficher ou masquer la boîte de dialogue
  constructor(  private ToastrService: ToasterService, private fb: FormBuilder, private router: Router , private userService : UserService,private tokenService:TokenService,@Inject(MAT_DIALOG_DATA) public data: any
  //private localStorage: LocalStorage,
  ) { }


  ngOnInit() {


   // let storedData =JSON.parse(this.localStorage.getItem('userData')) ;
    
    //console.log('UserName',storedData)


    
    this.lang = this.tokenService.getLang();
    this.lang = localStorage.getItem('lang')
    this.form = this.fb.group({
      NewPassword: ['', [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=\D*\d)(?=.*[$@$!%*?&])(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?!.*[+]).{7,30}$/ )]],
      OldPassword : [ '', [ Validators.required ]],
      confirm : [ '', [ Validators.required ]]},
       {
        validator: this.MustMatch('NewPassword', 'confirm')
     
    })
  }


  showConfirmModal() {
    this.isModalOpen = true;
  }


  hideConfirmModal() {
    this.isModalOpen = false;
  }
  toggleChildrenVisibility() {
    this.submitted = true;
    // Inverse la valeur de isChecked du nœud parent
    if(this.form.valid)
    this.isModalOpen = true
  }
  
  changePass() {
    this.submitted = true;
    if (this.form.valid) {
      console.log("username",this.data.name)
      this.userService.UpdatePasswordOnlogin(this.data.name,this.form.value).subscribe(
        () => {
           if (this.lang == 'fr') {
              this.ToastrService.pop( "Opération réussi")
              setTimeout(() => {
                window.location.reload();
              }, 5000);
 
   
  
          }
          else {
            this.ToastrService.pop( 'Success operation')
            setTimeout(() => {
              window.location.reload();
            }, 50000);
          
          }




        },
        (err) => {
        
          this.hasError = true;
          this.errorMessage = err.error;
          this.ToastrService.pop( "ancien mot de passe est incorrect! ")
          if (this.lang == 'en') {
            this.errorMessage = "The password is incorrect";
            this.ToastrService.pop( "old password is incorrect! ")
          }


        }
      )
    }
   
  }
  get f() { return this.form.controls; }


  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];


        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }


        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}


}




