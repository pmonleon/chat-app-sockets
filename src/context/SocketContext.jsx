import React, { useContext, useEffect } from 'react';
import { createContext } from 'react';
import { useSocket } from '../hooks/useSocket'
import { AuthContext } from '../auth/AuthContext';
import { ChatContext } from './chat/ChatContext';
import { scrollToBottomAnimated } from '../helpers/scrollToBottom';
import { types } from '../types/types';

export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {

    const { socket, online, conectarSocket, desconectarSocket } = useSocket('http://localhost:8080');
    const { auth } = useContext( AuthContext );
    const { dispatch } = useContext( ChatContext );

    useEffect(() => {
        if ( auth.logged ) {
            conectarSocket();
        }
    }, [ auth, conectarSocket ]);

    useEffect(() => {
        if ( !auth.logged ) {
            desconectarSocket();
        }
    }, [ auth, desconectarSocket ]);

      // Escuchar los cambios en los usuarios conectados
      useEffect(() => {
        
        socket?.on( 'lista-usuarios', (usuarios) => {
            console.log({usuarios})
            dispatch({
                type: types.usuariosCargados,
                payload: usuarios
            });
        })

    }, [ socket, dispatch ]);


    useEffect(() => {
        socket?.on('mensaje-personal', (mensaje) => {
            console.log({mensaje})
            dispatch({
                type: types.nuevoMensaje,
                payload: mensaje
            });

            scrollToBottomAnimated('mensajes');
        })

    }, [ socket, dispatch ]);

    
    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}