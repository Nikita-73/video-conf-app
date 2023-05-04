import {useCallback, useEffect, useRef, useState} from "react";
import socket from "../socket/index";
import ACTIONS from '../socket/actions'
import freeice from 'freeice'

export const LOCAL_VIDEO = 'LOCAL_VIDEO'

export default function useWebRTC(roomID) {
    const [clients, setStateClients] = useState([])
    const peerConnections = useRef({})
    const localMediaStream = useRef(null)
    const peerMediaElement = useRef({
        [LOCAL_VIDEO]: null
    })

    const addNewClient = useCallback((newClient, cb) => {
        if (!clients.includes(newClient)) {
            setStateClients(prev => [...prev, newClient])
            setTimeout(() => cb(), 1000)
        }

    }, [clients])


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

                if (tracksNumber === 2) { // video & audio tracks received
                    tracksNumber = 0


                    addNewClient(peerID, () => {
                        if (peerMediaElement.current[peerID]) {
                            peerMediaElement.current[peerID].srcObject = remoteStream;
                        }
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

        return () => {
            socket.off(ACTIONS.ADD_PEER);
        }
    }, [])


    useEffect(() => {
        async function setRemoteMedia({peerID, sessionDescription: remoteDescription}) {
            await peerConnections.current[peerID]?.setRemoteDescription(
                new RTCSessionDescription(remoteDescription)
            );


            if (remoteDescription.type === 'offer') {
                const answer = await peerConnections.current[peerID].createAnswer();


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


            setStateClients(list => list.filter(c => c !== peerID));
        };



        socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        return () => {
            socket.off(ACTIONS.REMOVE_PEER);
        }
    }, []);



    useEffect(() => {

        async function startCapture() {
            try {
                localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        width: 1280,
                        height: 720
                    }
                })
            } catch (e) {
                console.log(e)
            }


            addNewClient(LOCAL_VIDEO, () => {
                const localVideoElement = peerMediaElement.current[LOCAL_VIDEO]

                if (localVideoElement) {
                    localVideoElement.volume = 0
                    localVideoElement.srcObject = localMediaStream.current
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

    const microphoneLocal = function(selector){ // вкючение выключение локального микрофона
        const [audioTrack] = localMediaStream.current.getAudioTracks()
        if (audioTrack && selector) {
            audioTrack.enabled = false
        } if (audioTrack && !selector) {
            audioTrack.enabled = true
        }

    };

    const videoLocal = function(selector){ // вкючение выключение локального видео
        const [videoTrack] = localMediaStream.current.getVideoTracks()
        if (videoTrack && selector) {
            videoTrack.enabled = false
        } if (videoTrack && !selector) {
            videoTrack.enabled = true
        }
    };


    const captureScreenLocal = async function(selector){ // изменения захвата видео (меняем только видео без аудио дорожки)
        if (selector) {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    audio: true,
                    video: {
                        width: 1980,
                        height: 1080,
                        cursor: "always"
                    },
                })
                const [videoTrack] = stream.getVideoTracks()
                peerMediaElement.current['LOCAL_VIDEO'].srcObject = stream;
                for (const pc in peerConnections.current) {
                    const sender = peerConnections.current[pc]
                        .getSenders()
                        .find((s) => s.track.kind === videoTrack.kind);
                    await sender.replaceTrack(videoTrack);
                }
            } catch (e) {
                console.log("Error occurred", e);
            }
        } if (!selector) {
            try {
                const [videoTrack] = localMediaStream.current.getVideoTracks()
                peerMediaElement.current['LOCAL_VIDEO'].srcObject = localMediaStream.current;
                for (const pc in peerConnections.current) {
                    const sender = peerConnections.current[pc]
                        .getSenders()
                        .find((s) => s.track.kind === videoTrack.kind);
                    await sender.replaceTrack(videoTrack);
                }
            } catch (e) {
                console.log("Error occurred", e);
            }

        }
    }


    const provideMediaRef = useCallback((id, node) => {
        peerMediaElement.current[id] = node
    }, [])


    return{
        clients,
        provideMediaRef,
        microphoneLocal,
        videoLocal,
        captureScreenLocal
    }

}