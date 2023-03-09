import {useCallback, useEffect, useRef} from "react";
import useStateWithCallback from "./useStateWithCallback";
import socket from "../socket";
import ACTIONS from '../socket/actions'
import freeice from 'freeice'

export const LOCAL_VIDEO = 'LOCAL_VIDEO'

export default function useWebRTC(roomID) {
    const [clients, updateClients] = useStateWithCallback([])

    const addNewClient = useCallback((newClient, cb) => {
        if (!clients.includes(newClient)) {
            updateClients(list => [...list, newClient], cb)
        }
    }, [clients, updateClients])

    const peerConnections = useRef({})
    const localMediaStream = useRef(null)
    const localMediaStreamAudio = useRef(null) // только под аудио микрофона
    const peerMediaElement = useRef({
        [LOCAL_VIDEO]: null
    })


    useEffect(() => {
        async function handleNewPeer({peerID, createOffer}) {
            if (peerID in peerConnections.current) {
                return console.warn(`Already connected to peer${peerID}`)
            }

            peerConnections.current[peerID] = new RTCPeerConnection({iceServers: freeice()})

            peerConnections.current[peerID].onicecandidate = event => {
                if (event.candidate) {
                    socket.emit(ACTIONS.RELAY_ICE, {
                        peerID,
                        iceCandidate: event.candidate
                    })
                }
            }

            let tracksNumber = 0
            peerConnections.current[peerID].ontrack = ({streams: [remoteStream]}) => {
                tracksNumber++

                if (tracksNumber === 2) {// video & audio tracks received
                    tracksNumber = 0

                    addNewClient(peerID, () => {
                        peerMediaElement.current[peerID].srcObject = remoteStream
                    })
                }
            }

            localMediaStream.current.getTracks().forEach(track => {
                peerConnections.current[peerID].addTrack(track, localMediaStream.current)
            })

            if (createOffer) {
                const offer = await peerConnections.current[peerID].createOffer()

                await peerConnections.current[peerID].setLocalDescription(offer)

                socket.emit(ACTIONS.RELAY_SDP, {
                    peerID,
                    sessionDescription: offer
                })
            }


        }

        socket.on(ACTIONS.ADD_PEER, handleNewPeer);
    })


    useEffect(() => {
        async function setRemoteMedia({peerID, sessionDescription: remoteDescription}) {
            await peerConnections.current[peerID]?.setRemoteDescription(
                new RTCSessionDescription(remoteDescription)
            );


            if (remoteDescription.type === 'offer') {
                const answer = await peerConnections.current[peerID].createAnswer();

                console.log(clients)

                await peerConnections.current[peerID].setLocalDescription(answer);


                socket.emit(ACTIONS.RELAY_SDP, {
                    peerID,
                    sessionDescription: answer,
                });
            }
        }

        socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)

        return () => {
            socket.off(ACTIONS.SESSION_DESCRIPTION);
        }
    }, []);

    useEffect(() => {
        socket.on(ACTIONS.ICE_CANDIDATE, ({peerID, iceCandidate}) => {
            peerConnections.current[peerID]?.addIceCandidate(
                new RTCIceCandidate(iceCandidate)
            );
        });

        return () => {
            socket.off(ACTIONS.ICE_CANDIDATE);
        }
    }, []);


    useEffect(() => {
        const handleRemovePeer = ({peerID}) => {
            if (peerConnections.current[peerID]) {
                peerConnections.current[peerID].close();
            }

            delete peerConnections.current[peerID];
            delete peerMediaElement.current[peerID];

            updateClients(list => list.filter(c => c !== peerID));
        };

        socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        return () => {
            socket.off(ACTIONS.REMOVE_PEER);
        }
    }, []);


    useEffect(() => {
        async function startCapture() {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: 1280,
                    height: 720
                }
            })

            addNewClient(LOCAL_VIDEO, () => {
                const localVideoElement = peerMediaElement.current[LOCAL_VIDEO]

                if (localVideoElement) {
                    localVideoElement.volume = 0
                    localVideoElement.srcObject = localMediaStream.current
                    localMediaStreamAudio.current = localMediaStream.current // работает аудио микрофона
                }
            })
        }

        startCapture()
            .then(() => socket.emit(ACTIONS.JOIN, {room: roomID}))
            .catch(e => console.error('Error getting userMedia', e))

        return () => {
            localMediaStream.current.getTracks().forEach(track => track.stop())
            socket.emit(ACTIONS.LEAVE)
        }

    }, [roomID])//так а зачем, при переходе на новую страницу все перересовывается

    const microphoneOff = function(){
        const [audioTrack] = localMediaStreamAudio.current.getAudioTracks()
        debugger
        if (audioTrack) {
            audioTrack.enabled = false
        }
    };

    const microphoneOn = function(){
        const [audioTrack] = localMediaStreamAudio.current.getAudioTracks()
        debugger
        if (audioTrack) {
            audioTrack.enabled = true
        }

    };

    const videoOff = function(){
        const [videoTrack] = localMediaStream.current.getVideoTracks()
       //debugger
        if (videoTrack) {
            videoTrack.enabled = false;
        }
    };

    const videoOn = function(){
        const [videoTrack] = localMediaStream.current.getVideoTracks()
        //debugger
        if (videoTrack) {
            videoTrack.enabled = true;
        }
    };

    const captureScreen = async function(){
        try {
             const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: {
                    width: 1280,
                    height: 720,
                    cursor: "always"
                },
            })
            const [videoTrack] = stream.getVideoTracks()
            console.log(localMediaStream.current)
            console.log(peerMediaElement.current['LOCAL_VIDEO'].srcObject)
            peerMediaElement.current['LOCAL_VIDEO'].srcObject = stream;
            for (const pc in peerConnections.current){
                console.log(peerConnections.current[pc])
                const sender = peerConnections.current[pc]
                    .getSenders()
                    .find((s) => s.track.kind === videoTrack.kind);
                //console.log("Found sender:", sender);
                await sender.replaceTrack(videoTrack);
            }
            localMediaStream.current = stream
            console.log(localMediaStream.current)
            debugger

        } catch (ex) {
            console.log("Error occurred", ex);
        }
    }


    const provideMediaRef = useCallback((id, node) => {
        peerMediaElement.current[id] = node
    }, [])


    return{
        clients,
        provideMediaRef,
        microphoneOff,
        microphoneOn,
        videoOff,
        videoOn,
        captureScreen
    }

}