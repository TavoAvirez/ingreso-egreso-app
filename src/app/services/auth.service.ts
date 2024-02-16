import { inject, Injectable, Injector } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(    
    private auth: AngularFireAuth,
    private store: Store<AppState>
  ) {    
  }

  initAuthListener() {
    this.auth.authState.subscribe(async firebaseUser => {
      if(firebaseUser) {
        // existe usuario
        const user = await this.getUserFromFirebase(firebaseUser) as Usuario;
        this.store.dispatch(authActions.setUser({user}))
      } else {
        // NO existe usuario
        this.store.dispatch(authActions.unsetUser());
      }
    });
  }

  private async getUserFromFirebase(firebaseUser: firebase.User) {
    const db = getDatabase();
    const user = (await get(ref(db, `${firebaseUser?.uid}/usuario`))).val();
    return user;
  }

  async crearUsuario(nombre: string, email: string, password: string) {
    const { user } = await this.auth.createUserWithEmailAndPassword(      
      email,
      password
    );

    const db = getDatabase();
    await set(ref(db, `${user?.uid}/usuario`), {
      uid: user?.uid,
      nombre,
      email,
    });

    return user;
  }

  loginUsuario(email: string, password: string) {
    const res = this.auth.signInWithEmailAndPassword(email.trim(), password.trim());
    return res;
  }

  logout() {
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
