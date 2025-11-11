import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {


  error: boolean = false;
  loginData!: FormGroup;

  constructor(
    private fb:FormBuilder,
    private data:Auth,
    private router:Router
  ) {}

  ngOnInit() {
    this.loginData = this.fb.group({
      email: ['',Validators.required],
      motDePasse: ['',Validators.required]
    });
    console.log("Chuis la !!!")
  }
  onSubmit() {
    console.log(this.loginData.value);
    if (this.loginData.valid) {
      this.data.login(this.loginData.value).subscribe(
        (res)=>{
          Auth.saveToken(res.data.token);
          this.router.navigateByUrl("/");
        },
        (error)=>{
          this.error = true;
          console.log(error);
        }
      )
    } else {
      this.error = true;
    }
  }
  changer(){
    this.error = false;
  }

  showPassword = signal(false);
  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

}
