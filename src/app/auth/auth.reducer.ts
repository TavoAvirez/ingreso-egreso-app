import { Action, createReducer, on } from '@ngrx/store';
import * as authActions from './auth.actions';
import { Usuario } from '../models/usuario.model';

export interface State {
    user: Usuario | null; 
}

export const initialState: State = {
   user: null,
}

const _authReducer = createReducer(initialState,
    // ... desestructuracion, toma tomas las propiedades del objeto para quitar alguna referencia
    on(authActions.setUser, (state, {user}) => ({ ...state, user:  {... user}})),
    on(authActions.unsetUser, (state) => ({ ...state, user: null})),

);

export function authReducer(state: State | undefined, action: Action) {
    return _authReducer(state, action);
}