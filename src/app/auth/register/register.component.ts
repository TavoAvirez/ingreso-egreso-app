import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import * as uiActions from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {  
  registerForm!: FormGroup;
  isLoading = false;
  registerSubscription!: Subscription;
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
    ) {
    
  }
 

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.registerSubscription = this.store.select('ui').subscribe(ui => this.isLoading = ui.isLoading);
  }

  ngOnDestroy(): void {    
    this.registerSubscription.unsubscribe();    
  }

  // rVk49JEICkOBNCXq2LKVvvfBMQF2
  crearUsuario() {
    if(this.registerForm.invalid) {
      return;
    }

    //lanzar la action isLoading
    this.store.dispatch(uiActions.isLoading());

    const {nombre, correo, password} = this.registerForm.value;
    this.authService.crearUsuario(nombre, correo, password)
      .then(credenciales => {
        this.store.dispatch(uiActions.stopLoading());
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      });
      
  }
  
}
