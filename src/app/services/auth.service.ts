import { inject, Injectable, Injector } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore } from '@angular/fire/firestore/firestore';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private injector: Injector, 
    private auth: AngularFireAuth,
    
    ) {
    // console.log(this.firestore.toJSON())
  }

  initAuthListener() {
    this.auth.authState.subscribe( firebaseUser => {
      console.log(firebaseUser)
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    const res = this.auth.createUserWithEmailAndPassword(email.trim(),
      password.trim())
        .then(({user}) => {
          const newUser = new Usuario((user?.uid as string), nombre, email);
          
        });
    return res;
  }

  loginUsuario(email: string, password:string) {
    const res = this.auth.signInWithEmailAndPassword(email.trim(), password.trim());
    return res;
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(): Observable<boolean> {
    return this.auth.authState.pipe(
      map(firebaseUser => {
        return firebaseUser != null 
      })
    );

    
  }
}
