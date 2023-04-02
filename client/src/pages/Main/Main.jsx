import React, {useEffect, useRef, useState} from 'react';
import socket from "../../socket";
import ACTIONS from '../../socket/actions';
import {useHistory} from "react-router";
import {v4} from 'uuid'
import MainTemplateUI from '../Main/MainTemplateUI'

const Main = () => {

    const history = useHistory()
    const [rooms, updateRooms] = useState([])
    const rootNode = useRef()

    useEffect( () => {
        socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
            //if (rootNode.current) {
                updateRooms(rooms)
            //}
        })
    }, [])


    const createNewRoom = function(){
        const roomID = v4()
        history.push(`/room/${roomID}`)
        setTimeout( () => {
            socket.emit(ACTIONS.ADD_MEMBER, {
                roomIDMember: roomID,
                memberID: socket.id,
                host: true

            })
        }, 2000) // таймаут для прогрузки страницы комнаты(добавления комнаты на сервере)
    }

    const joiningRoom = function(roomID){
        history.push(`/room/${roomID}`)
        socket.emit(ACTIONS.ADD_MEMBER, {
            roomIDMember: roomID,
            memberID: socket.id,
            host: false
        })
    }

    return (
        <div>
            <h1>Available Rooms</h1>
            <ul>
                {rooms.map(roomID => (
                    <li key={roomID}>
                        {roomID}
                        <button onClick={() => {joiningRoom(roomID)}}>JOIN ROOM</button>
                    </li>
                ))}
            </ul>
            <button onClick={createNewRoom}>Create new room</button>
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