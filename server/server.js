const path = require('path')
const express = require('express')
const app = express()
const fs = require('fs');
const cors = require('cors')

//const server = require('http').createServer(app)

const server = require('https').createServer({
    key: fs.readFileSync(path.resolve('.cert/key.pem')),
    cert: fs.readFileSync(path.resolve('.cert/cert.pem'))
}, app)


const io = require('socket.io')(server, {
    cors: {
        origin: ['https://localhost:3000', 'https://192.168.0.141:3000'],
    }
})

const ACTIONS = require('./src/actions')
const {validate, version} = require("uuid");
const PORT = process.env.PORT || 3001
const roomsMembers = {}



function getClientRoom(){
    const {rooms} = io.sockets.adapter

    return Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4)
}

function shareRoomsInfo(){
    io.emit(ACTIONS.SHARE_ROOMS, {rooms: getClientRoom()})
}
//присоединение к комнате(начало)
io.on('connection', socket => {
    shareRoomsInfo()

    socket.on(ACTIONS.ADD_MEMBER, ({roomIDMember, memberID, host, name, surname}) => {
        try {

            if (!roomsMembers[roomIDMember] && host) {
                roomsMembers[roomIDMember] = []
                roomsMembers[roomIDMember].push({memberID, host, name, surname})
            } else {
                roomsMembers[roomIDMember].push({memberID, host, name, surname})
            }


            roomsMembers[roomIDMember].forEach(clients => {
                io.to(clients.memberID).emit(ACTIONS.SHARE_ROOM_MEMBERS, {
                    roomMembersList: roomsMembers[roomIDMember]
                })

            })
        } catch (e) {
            // сделано чтобы сервер не падал из-за неверного айдишника
        }
    })


    socket.on(ACTIONS.JOIN, config => {
        const {room: roomID} = config
        const {rooms: joinedRoms} = socket

        if (Array.from(joinedRoms).includes(roomID)) {
            return console.warn(`Already joined to ${roomID}`)
        }

        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || [])

        clients.forEach(clientID => {
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
        const memberIDRoom = [...rooms]

        try {
            const memberDelete = roomsMembers[memberIDRoom[1]].findIndex(item => item.memberID === socket.id)
            if (memberDelete >= 0)
                roomsMembers[memberIDRoom[1]].splice(memberDelete, 1)
            roomsMembers[memberIDRoom[1]].forEach(clients => {
                io.to(clients.memberID).emit(ACTIONS.SHARE_ROOM_MEMBERS, {
                    roomMembersList: roomsMembers[memberIDRoom[1]]
                })
            })
        } catch(e) {
            //console.log('error index')
        }


        Array.from(rooms).
        forEach(roomID => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || [])

            clients.forEach(clientID => {
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

    socket.on(ACTIONS.REMOVE_MEMBER, ({membersList, memberIDRemove}) => {
        membersList.forEach(clients => {
            io.to(clients.memberID).emit(ACTIONS.MEMBER_FORCED_DISCONNECTING, {memberIDRemove})
        })
    })

    socket.on(ACTIONS.MEMBER_CLEAN_LIST, ({memberIDRoom, memberID}) => {
        const memberDelete = roomsMembers[memberIDRoom].findIndex(item => item.memberID === memberID)
        if (memberDelete >= 0)
            roomsMembers[memberIDRoom].splice(memberDelete, 1)

        roomsMembers[memberIDRoom].forEach(clients => {
            io.to(clients.memberID).emit(ACTIONS.SHARE_ROOM_MEMBERS, {
                roomMembersList: roomsMembers[memberIDRoom]
            })
        })
    })


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
    //console.log('socket onnnnnn')
})

/*app.use(express.static(path.join(__dirname, '../client', 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
});
*/
server.listen(PORT, () => {
    //console.log('server started')
})


