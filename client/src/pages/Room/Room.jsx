import {useState, useEffect} from 'react';
import {useParams, useHistor} from "react-router";
import useWebRTC, {LOCAL_VIDEO} from "../../hooks/useWebRTC";
import socket from "../../socket";
import {observer} from 'mobx-react-lite'
import {Grid, Button, Box, AppBar, Toolbar, Typography, ButtonGroup, Drawer} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DrawerMemberUI from './DrawerMemberUI'
import PersonIcon from '@mui/icons-material/Person';
import WindowIcon from '@mui/icons-material/Window';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import stateMembersRoom from '../../store/stateMembersRoom'





const Room = observer(() => {    // observer можно убрать так как у меня и так много рендеров, но надо глянуть
    const {id: roomID} = useParams();
    const {clients, provideMediaRef, microphoneLocal, videoLocal, captureScreenLocal} = useWebRTC(roomID);

    const [stateMic, setStateMic] = useState(true)
    const [stateVideo, setStateVideo] = useState(true)
    const [stateCapture, setStateCapture] = useState(true)
    const [stateDrawer, setStateDrawer] = useState(false)
    const [stateChangeView, setStateChangeView] = useState(6)

    const microphoneChange = function() {
        microphoneLocal(stateMic)
        setStateMic(prev => !prev)
    }

    const videoChange = function() {
        videoLocal(stateVideo)
        setStateVideo(prev => !prev)
    }

    const captureChange = function() {
        captureScreenLocal(stateCapture)
        setStateCapture(prev => !prev)
    }

    const exitRoomHandle = () => {
        document.location.href = 'https://localhost:3000'
    }

    const copyRoomIdHandle = () => {
        navigator.clipboard.writeText(`${roomID}`)
        alert('Приглашение скопировано')
    }

    useEffect(() => {
        setTimeout (() => {
            if (stateMembersRoom.videoState === false) {
                videoChange()
            }
            if (stateMembersRoom.microphoneState === false) {
                microphoneChange()
            }
        }, 1200)// webrtc может не успеть отработать
    }, [])

    const changeView = () => {
        setStateChangeView(prev => prev === 6 ? 12 : 6)
    }

    const tegName = (clientID) => {
        return stateMembersRoom.listMembers.map(item => {
            if(clientID === 'LOCAL_VIDEO')
                if(socket.id === item.memberID)
                    return `${item.name} ${item.surname}`
            if(clientID === item.memberID)
                return `${item.name} ${item.surname}`
        })
    }


    return (
        <>
            <Box sx={{
                height: '100%',
                position: 'relative'
            }}>
                <AppBar position='static'>
                        <Toolbar sx={{minHeight: '50px !important', justifyContent: 'space-between'}}>
                                <Typography
                                    marginRight={'10px'}
                                    variant="h6"
                                >
                                    Video Chat
                                </Typography>
                            <ButtonGroup size="small" aria-label="small button group" variant='text'  sx={{
                                backgroundColor: 'red',
                            }}>
                                <Button onClick={microphoneChange}>Micro On/Off</Button>
                                <Button onClick={videoChange}>Video On/Off</Button>
                                <Button onClick={captureChange}>Capture Screen On/Off</Button>
                            </ButtonGroup>
                            <Box sx={{marginLeft: '10px'}}>
                                <WindowIcon sx={{marginRight: '10px'}} onClick={changeView}/>
                                <PersonIcon sx={{marginRight: '10px'}} onClick={() => {setStateDrawer(true)}}/>
                                <CopyAllIcon sx={{marginRight: '10px'}} onClick={copyRoomIdHandle}/>
                                <ExitToAppIcon onClick={exitRoomHandle}/>
                            </Box>
                        </Toolbar>
                </AppBar>



                <Box sx={{
                    width: '80%',
                    height: '100%',
                    margin: 'auto'

                }}>
                    <Grid container spacing={2} sx={{marginTop: '2px'}}>
                        {clients.map((clientID) => {
                            return (
                                <Grid item xs={12} md={stateChangeView} key={clientID} id={clientID} >
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
                                    {tegName(clientID)}
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Box>
            <DrawerMemberUI cartOpen={stateDrawer} closeCart={() => setStateDrawer(false)}/>
        </>
    );
})

export default Room;
