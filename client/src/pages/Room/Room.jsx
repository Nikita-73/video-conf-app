import {useState, useEffect} from 'react';
import {useParams} from "react-router";
import useWebRTC, {LOCAL_VIDEO} from "../../hooks/useWebRTC";
import socket from "../../socket";
import {observer} from 'mobx-react-lite'
import stateMembersRoom from '../../store/stateMembersRoom'
import {Grid, Button, Box, AppBar, Toolbar, Typography, ButtonGroup, Drawer} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DrawerMemberUI from './DrawerMemberUI'
import PersonIcon from '@mui/icons-material/Person';
import WindowIcon from '@mui/icons-material/Window';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import CircularProgress from '@mui/material/CircularProgress';
import '../Room/styles/RoomBorderVideo.css'
import '../Room/styles/RoomBorderVideoShow.css'







const Room = observer(() => {    // observer можно убрать так как у меня и так много рендеров, но надо глянуть
    const {id: roomID} = useParams();
    const {clients, provideMediaRef, microphoneLocal, videoLocal, captureScreenLocal} = useWebRTC(roomID);

    const [stateMic, setStateMic] = useState(stateMembersRoom.microphoneState)
    const [stateVideo, setStateVideo] = useState(stateMembersRoom.videoState)
    const [stateCapture, setStateCapture] = useState(true)
    const [stateDrawer, setStateDrawer] = useState(false)
    const [stateChangeView, setStateChangeView] = useState(6)
    const [statePreloaderCircle, setStatePreloaderCircle] = useState('block')

    const microphoneChange = function() {
        microphoneLocal(stateMic)
        setStateMic(prev => !prev)
    }

    const colorMicrophoneButton = {
        color: stateMic ? 'success' : 'error'
    }

    const videoChange = function() {
        videoLocal(stateVideo)
        setStateVideo(prev => !prev)
    }

    const colorVideoButton = {
        color: stateVideo ? 'success' : 'error'
    }

    const captureChange = function() {
        captureScreenLocal(stateCapture)
        setStateCapture(prev => !prev)
    }

    const exitRoomHandle = () => {
        document.location.href = '/'
    }

    useEffect(() => {
        return () => {
            document.location.href = '/'
        }
    }, [])

    const copyRoomIdHandle = () => {
        navigator.clipboard.writeText(`Здравствуйте, это преглашение на видеоконференцию \r\n Сайт: https://localhost:3000/ \r\n Идентификатор комнаты:  ${roomID}`)
        alert('Приглашение скопировано')
    }


    const changeView = () => {
        setStateChangeView(prev => prev === 6 ? 12 : 6)
    }


    const changeViewSizeGridVideo = () => {
        if (stateChangeView === 6) {
            return {maxHeight: '500px', maxWidth: '100%'}
        } else {
            return {height: '100%', width: '100%'}
        }
    }

    const changeViewSizeBoxVideo = () => {
        if (stateChangeView === 6) {
            return {maxHeight: '500px', maxWidth: '670px', position: 'relative'}
        } else {
            return {height: '100%', width: '100%', marginBottom: '2000px', position: 'relative'}
        }
    }

    const changeViewBorderVideo = () => {
        if (stateChangeView === 6) {
            return 'gradient-border'
        } else {
            return 'show-video'
        }
    }

    const changeViewTagNameVideo = () => {
        if (stateChangeView === 6) {
            return {position: 'absolute', width: '569px', bottom:'-30px', left: '0',
                font: 'small-caps bold 24px/1 sans-serif', textAlign: 'center', boxSizing: 'border-box', color: 'white'}
        } else {
            return {display: 'none'}
        }
    }


    const tagName = (clientID) => {
        return stateMembersRoom.listMembers.map(item => {
            if(clientID === 'LOCAL_VIDEO')
                if(socket.id === item.memberID)
                    return `${item.name} ${item.surname}`
            if(clientID === item.memberID)
                return `${item.name} ${item.surname}`
        })
    }

    const displayStreams = () => {
        return clients.map((clientID) => {
            return (
                <Grid item xs={12}
                      md={stateChangeView}
                      key={clientID}
                      sx={changeViewSizeGridVideo()}
                >
                        <Box sx={changeViewSizeBoxVideo()}>
                            <video
                                className={changeViewBorderVideo()}
                                ref={instance => {
                                    provideMediaRef(clientID, instance);
                                }}
                                autoPlay
                                playsInline
                                muted={clientID === LOCAL_VIDEO}
                            />
                            <Box sx={changeViewTagNameVideo()}>
                                {tagName(clientID)}
                            </Box>
                        </Box>
                </Grid>
            );
        })
    }

    useEffect(() => {
        setTimeout(() => setStatePreloaderCircle('none'), 2000)
    }, [])

    const showPreloaderCircle = () => {
        return (<Box sx={{
            display: `${statePreloaderCircle}`,
            position: 'absolute',
            width: '100%',
            height: '100%',
            marginTop: '10px',
            backgroundColor: '#1e1e21',
            zIndex: '1',
        }}>
            <Box sx={{
                position: 'absolute',
                left: '50%',
                top: '45%',
                transform: 'translate(-50%, -50%)'
            }}>
                <CircularProgress />
            </Box>
        </Box>)
    }


    return (
        <div style={{height: "100%", width:'100%'}}>
            <Box sx={{
                height: '100%',
                width: '100%',
            }}>
                <AppBar position='static'>
                        <Toolbar sx={{minHeight: '50px !important', justifyContent: 'space-between'}}>
                                <Typography
                                    marginRight={'10px'}
                                    variant="h6"
                                    sx={{font: 'small-caps bold 24px/1 sans-serif'}}
                                >
                                    ВИДЕО ЧАТ
                                </Typography>
                            <ButtonGroup size="small" aria-label="small button group" variant="contained"  sx={{
                            }}>
                                <Button
                                    color={colorMicrophoneButton.color}
                                    sx={{font: 'small-caps bold 17px/1 sans-serif'}}
                                    onClick={microphoneChange}
                                >
                                    Микрофон
                                </Button>
                                <Button
                                    color={colorVideoButton.color}
                                    sx={{font: 'small-caps bold 17px/1 sans-serif'}}
                                    onClick={videoChange}
                                >
                                    Видео
                                </Button>
                                <Button
                                    color='secondary'
                                    sx={{font: 'small-caps bold 17px/1 sans-serif'}}
                                    onClick={captureChange}
                                >
                                    Захват экрана
                                </Button>
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
                    maxWidth: '80%',
                    height: '100%',
                    margin: 'auto',
                    position: 'relative'
                }}>
                    {showPreloaderCircle()}
                    <Grid container spacing={2} sx={{marginTop: '10px', height: '100%', width: '100%'}}>
                        {displayStreams()}
                    </Grid>
                </Box>
            </Box>
            <DrawerMemberUI cartOpen={stateDrawer} closeCart={() => setStateDrawer(false)}/>
        </div>
    );
})

export default Room;




/*const changeViewSizeVideoHeight = () => {
       if (stateChangeView === 6) {
           return '344px'
       } else {
           return '100%'
       }
   }

   const changeViewSizeVideoWidth = () => {
       if (stateChangeView === 6) {
           return '610px'
       } else {
           return '100%'
       }
   }*/
