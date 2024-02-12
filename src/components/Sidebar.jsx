import React, { useContext } from 'react'
import { SidebarChatItem } from './SidebarChatItem'
import { ChatContext } from '../context/chat/ChatContext';
import { AuthContext } from '../auth/AuthContext';

export const Sidebar = () => {

    const { chatState } = useContext( ChatContext );
    const { auth } = useContext( AuthContext );

    const { uid } = auth;


    return (
        <div className="inbox_chat">

            {
                chatState?.usuarios
                    .filter( user => user.uid !== uid )
                    .map( (usuario) => (
                    <SidebarChatItem 
                        key={ usuario.uid }
                        usuario={ usuario }
                    />
                ))
            }



            {/* <!-- Espacio extra para scroll --> */}
            <div className="extra_space"></div>


        </div>

    )
}