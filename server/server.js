const path = require('path')
const express = require('express')
const app = express()
const fs = require('fs');
const cors = require('cors')

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://192.168.0.141:3000'],
    }
})

const ACTIONS = require('./src/actions')
const {validate, version} = require("uuid");
const PORT = process.env.PORT || 3001



function getClientRoom(){
    const {rooms} = io.sockets.adapter

    return Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4)
}

function shareRoomsInfo(){
    io.emit(ACTIONS.SHARE_ROOMS, {rooms: getClientRoom()})
}

io.on('connection', socket => {
    shareRoomsInfo()

    //присоединение к комнате(начало)
    socket.on(ACTIONS.JOIN, config => {
        const {room: roomID} = config
        const {rooms: joinedRoms} = socket

        if (Array.from(joinedRoms).includes(roomID)) {
            return console.warn(`Already joined to ${roomID}`)
        }

        const client = Array.from(io.sockets.adapter.rooms.get(roomID) || [])

        client.forEach(clientID => {
            io.to(clientID).emit(ACTIONS.ADD_PEER, {
                peerID: socket.id,
                createOffer: false
            })

            socket.emit(ACTIONS.ADD_PEER, {
                peerID: clientID,
                createOffer: true
            })
        })

        socket.join(roomID)
        shareRoomsInfo()
    })
    //присоединение к комнате(конец)

    //отсоединение от комнаты(начало)
    function leaveRoom() {
        const {rooms} = socket

        Array.from(rooms).
        forEach(roomID => {
            const client = Array.from(io.sockets.adapter.rooms.get(roomID) || [])

            client.forEach(clientID => {
                io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
                    peerID: socket.id
                })

                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerID: clientID
                })
            })
            socket.leave(roomID)
        })
        shareRoomsInfo()
    }

    socket.on(ACTIONS.LEAVE, leaveRoom)
    socket.on('disconnecting', leaveRoom)
    //отсоединение от комнаты(конец)

    socket.on(ACTIONS.RELAY_SDP, ({peerID, sessionDescription}) => {
        io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerID: socket.id,
            sessionDescription
        })
    })

    socket.on(ACTIONS.RELAY_ICE, ({peerID, iceCandidate}) => {
        io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
            peerID: socket.id,
            iceCandidate
        })
    })
})






io.on('connection', socket => {
    console.log('socket onnnnnn')
})

/*app.use(express.static(path.join(__dirname, '../client', 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
});
*/
server.listen(PORT, () => {
    console.log('server started')
})