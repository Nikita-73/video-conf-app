import {useState, useEffect} from 'react';
import {useParams} from "react-router";
import useWebRTC, {LOCAL_VIDEO} from "../../hooks/useWebRTC";
import ACTIONS from "../../socket/actions";
import socket from "../../socket/index";


function layout(clientsNumber = 1) {
    const pairs = Array.from({length: clientsNumber})
        .reduce((acc, next, index, arr) => {
            if (index % 2 === 0) {
                acc.push(arr.slice(index, index + 2));
            }

            return acc;
        }, []);

    const rowsNumber = pairs.length;
    const height = `${100 / rowsNumber}%`;

    return pairs.map((row, index, arr) => {

        if (index === arr.length - 1 && row.length === 1) {
            return [{
                width: '100%',
                height,
            }];
        }

        return row.map(() => ({
            width: '50%',
            height,
        }));
    }).flat();
}


const Room = () => {
    const {id: roomID} = useParams();
    const {clients, provideMediaRef, microphoneLocal, videoLocal, captureScreenLocal} = useWebRTC(roomID);
    const videoLayout = layout(clients.length);

    const [stateMic, setStateMic] = useState(true)
    const [stateVideo, setStateVideo] = useState(true)
    const [stateCapture, setStateCapture] = useState(true)

    const microphoneChange = function(){
        microphoneLocal(stateMic)
        setStateMic(prev => !prev)
    }

    const videoChange = function(){
        videoLocal(stateVideo)
        setStateVideo(prev => !prev)
    }

    const captureChange = function(){
        captureScreenLocal(stateCapture)
        setStateCapture(prev => !prev)
    }

    useEffect(() => {
        socket.on(ACTIONS.MEMBER_CONNECT,  ({memberID}) => {
            console.log('pustite')
            if(window.confirm(`Пустить клиента ${memberID}`)) {
                console.log('ок')


                socket.emit(ACTIONS.MEMBER_PASS, {memberID})


            }
        })

        socket.on(ACTIONS.JOIN_ROOM, () => {
            console.log('я вернулся')
            socket.emit(ACTIONS.MEMBER_PASS_DONE, {id: socket.id})
        })

    }, [])



    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            height: '100vh',
        }}>
            {clients.map((clientID, index) => {
                return (
                    <div key={clientID} style={videoLayout[index]} id={clientID}>
                        <video
                            width='100%'
                            height='100%'
                            ref={instance => {
                                provideMediaRef(clientID, instance);
                            }}
                            autoPlay
                            playsInline
                            muted={clientID === LOCAL_VIDEO}
                        />
                        <button onClick={microphoneChange}>Micro On/Off</button>
                        <button onClick={videoChange}>Video On/Off</button>
                        <button onClick={captureChange}>CaptureScreen On/Off</button>
                    </div>
                );
            })}
        </div>
    );
};

export default Room;