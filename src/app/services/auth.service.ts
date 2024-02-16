import { inject, Injectable, Injector } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDatabase, ref, set } from 'firebase/database';
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
    this.auth.authState.subscribe(firebaseUser => {
      console.log(firebaseUser)
    });
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
