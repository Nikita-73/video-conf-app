import {useState, useEffect} from 'react';
import {useParams} from "react-router";
import useWebRTC, {LOCAL_VIDEO} from "../../hooks/useWebRTC";
import ACTIONS from "../../socket/actions";
import socket from "../../socket/index";
import {Grid, Button, Box, AppBar, Toolbar, Typography, ButtonGroup } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';





const Room = () => {
    const {id: roomID} = useParams();
    const {clients, provideMediaRef, microphoneLocal, videoLocal, captureScreenLocal} = useWebRTC(roomID);

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
        <Box sx={{
            height: '100%',
            position: 'relative'
        }}>
            <AppBar position='static'>
                    <Toolbar sx={{minHeight: '50px !important', justifyContent: 'space-between'}}>
                            <Typography
                                variant="h6"
                            >
                                Video Chat
                            </Typography>
                        <ButtonGroup size="small" aria-label="small button group" variant='text'  sx={{
                            backgroundColor: 'red',
                        }}>
                            <Button onClick={microphoneChange}>Micro On/Off</Button>
                            <Button onClick={videoChange}>Video On/Off</Button>
                            <Button onClick={captureChange}>CaptureScreen On/Off</Button>
                        </ButtonGroup>
                        <ExitToAppIcon/>
                    </Toolbar>
            </AppBar>



            <Box sx={{
                marginTop: '10px',
                width: '80%',
                height: '100%',
                margin: 'auto'

            }}>
                <Grid container spacing={2}>
                    {clients.map((clientID) => {
                        return (
                            <Grid item xs={12} md={6} key={clientID} id={clientID}>
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
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
};

export default Room;
