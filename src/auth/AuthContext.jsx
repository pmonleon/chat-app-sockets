import React, { createContext, useCallback, useContext, useState } from 'react';
import { fetchConToken, fetchSinToken } from '../helpers/fetch';
import { ChatContext } from '../context/chat/ChatContext';
import { types } from '../types/types';

export const AuthContext = createContext();

const initialState = {
    uid: null,
    checking: true,
    logged: false,
    name: null,
    email: null,
};


export const AuthProvider = ({ children }) => {

    const [ auth, setAuth ] = useState(initialState)
    const { dispatch } = useContext( ChatContext );

    const login = async( email, password ) => {

        const resp = await fetchSinToken('login', { email, password }, 'POST');

        if ( resp.ok ) {
            localStorage.setItem('token', resp.token );
            const { usuario } = resp;

            setAuth({
                uid: usuario.uid,
                checking: false,
                logged: true,
                name: usuario.nombre,
                email: usuario.email,
            });

            return resp.ok

        }

        return resp.msg;

    }

    const register = async(nombre, email, password) => {

        const resp = await fetchSinToken('login/new', { nombre, email, password }, 'POST');
        
        if ( resp.ok ) {
            localStorage.setItem('token', resp.token );
            const { usuario } = resp;

            setAuth({
                uid: usuario.uid,
                checking: false,
                logged: true,
                name: usuario.nombre,
                email: usuario.email,
            });

            return resp.ok;
        }

        return resp.msg;

    }

    const verificaToken = useCallback( async() => {

        const token = localStorage.getItem('token');
        // Si token no existe
        if ( !token ) {
            setAuth({
                ...initialState,
                checking: false,
            })

            return false;
        }

        const resp = await fetchConToken('login/renew');
        if ( resp.ok ) {
            localStorage.setItem('token', resp.token );
            const { usuario } = resp;

            setAuth({
                uid: usuario.uid,
                checking: false,
                logged: true,
                name: usuario.nombre,
                email: usuario.email,
            });

            return true;
        } else {
            setAuth({
                ...initialState,
                checking: false,
            });

            return false;
        }

    }, [])

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({
            ...initialState,
            checking: false,
        });
        dispatch({
            type: types.cerrarSesion
        })
    }


    return (
        <AuthContext.Provider value={{
            auth,
            login,
            register,
            verificaToken,
            logout,
        }}>
            { children }
        </AuthContext.Provider>
    )
}

