import React, {useEffect, useRef, useState} from 'react';
import socket from "../../socket";
import ACTIONS from '../../socket/actions';
import {useHistory} from "react-router";
import {v4} from 'uuid'

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
        const roomIDHost = v4()
        history.push(`/room/${roomIDHost}`)
        socket.emit(ACTIONS.HOST_ROOM, {
            roomIDHost,
            hostID: socket.id
        })
        socket.emit(ACTIONS.MEMBER_PASS_DONE, {id: socket.id})
    }

    const joiningRoom = function(roomID){
        history.push(`/room/${roomID}`)
        socket.emit(ACTIONS.CALL_HOST, {
            roomIDMember: roomID,
            memberID: socket.id
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