import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TokenService } from 'app/services/token.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-reinstalisation-pass',
  templateUrl: './reinstalisation-pass.component.html',
  styleUrls: ['./reinstalisation-pass.component.scss']
})
export class ReinstalisationPassComponent {


  form: FormGroup;
  hasError = false;
  errorMessage: string;
  submitted = false;
  lang: any;
  loginTime: number;
  maxPasswordExpiryDays: number;
  passwordExpiryDate: Date;
  isModalOpen = false; // Utilisée pour afficher ou masquer la boîte de dialogue
  constructor(
    private userService: UserService,
    private router: Router, private fb: FormBuilder,
 
    private tokenService: TokenService, private ToastrService: ToasterService,@Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
   
 this.lang = this.tokenService.getLang();
    this.form = this.fb.group({


      NewPassword: ['', [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=\D*\d)(?=.*[$@$!%*?&])(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{7,30}$/)]],
      confirm: ['', [Validators.required]]
    },
      {
        validator: this.MustMatch('NewPassword', 'confirm')


      })
    // login time on initialization
    this.loginTime = Date.now();
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
      this.userService.updatePassword(this.data.name,this.form.value).subscribe(
        () => {
           if (this.lang == 'fr') {
               this.ToastrService.pop("info", "Opération réussi")
          }
          else {
            this.ToastrService.pop( 'Success operation')
          }




        },
        (err) => {
        
          this.hasError = true;
          this.errorMessage = err.error;
          if (this.lang == 'en') {
            this.errorMessage = "The password is incorrect";
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
