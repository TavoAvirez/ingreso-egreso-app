import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as uiActions from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading = false;
  uiSubscription!: Subscription

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {

  }

  ngOnInit(): void {    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => this.isLoading = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();  
  }

  loginUsuario() {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoading());

    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario(email, password)
      .then(login => {
        this.store.dispatch(uiActions.stopLoading());
        this.router.navigate(['/'])
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
