import React from 'react';
import socket from "../../socket";
import ACTIONS from '../../socket/actions';
import {v4} from 'uuid'
import MainTemplateUI from '../Main/MainTemplateUI'

const Main = () => {


    const createNewRoom = function(name, surname){
        const roomID = v4()
        document.location.href = `/room/${roomID}`
        setTimeout( () => {
            socket.emit(ACTIONS.ADD_MEMBER, {
                roomIDMember: roomID,
                memberID: socket.id,
                host: true,
                name,
                surname

            })
        }, 2000) // таймаут для прогрузки страницы комнаты(добавления комнаты на сервере)
    }

    const joiningRoom = function(roomID, name, surname){
        document.location.href = `/room/${roomID}`
        socket.emit(ACTIONS.ADD_MEMBER, {
            roomIDMember: roomID,
            memberID: socket.id,
            host: false,
            name,
            surname
        })
    }

    return (
        <div>
            <MainTemplateUI joiningRoom={joiningRoom} createNewRoom={createNewRoom}/>
        </div>
    );
};

export default Main;

/*  <h1>Available Rooms</h1>
            <ul>
                {rooms.map(roomID => (
                    <li key={roomID}>
                        {roomID}
                        <button onClick={() => {joiningRoom(roomID)}}>JOIN ROOM</button>
                    </li>
                ))}
            </ul>
            <button onClick={createNewRoom}>Create new room</button>

            <div>
            <MainTemplateUI joiningRoom={joiningRoom} createNewRoom={createNewRoom}/>
        </div>



            */