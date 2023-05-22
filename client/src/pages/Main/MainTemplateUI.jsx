import {useState, useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import socket from "../../socket";
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import stateMembersRoom from '../../store/stateMembersRoom'
import my_image from '../Main/fonts/image_first.jpg'



const MainTemplateUI = ({joiningRoom, createNewRoom}) => {

    const [inputRoom, setInputRoom] = useState('')
    const [inputName, setInputName] = useState('')
    const [inputSurname, setInputSurname] = useState('')
    const [stateMicrophone, setStateMicrophone] = useState(true)
    const [stateVideo, setStateVideo] = useState(true)
    const [stateButtonRoom, setStateButtonRoom] = useState(true)

    const colorMicrophoneButton = {
        color: stateMicrophone ? 'success' : 'error'
    }

    const colorVideoButton = {
        color: stateVideo ? 'success' : 'error'
    }

    useEffect(() => {
        stateMembersRoom.setMicrophoneSwitch(stateMicrophone)
    }, [stateMicrophone])

    useEffect(() => {
        stateMembersRoom.setVideoSwitch(stateVideo)
    }, [stateVideo])

    useEffect(() => {
        if (inputRoom.length === 36) {
            setStateButtonRoom(false)
        } else {
            setStateButtonRoom(true)
        }

    }, [inputRoom])


    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${my_image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box

                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Форма входа
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            autoComplete="given-name"
                            name="firstName"
                            fullWidth
                            id="firstName"
                            label="Имя"
                            autoFocus
                            value={inputName}
                            onChange={e => setInputName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="lastName"
                            label="Фамилия"
                            name="lastName"
                            autoComplete="family-name"
                            value={inputSurname}
                            onChange={e => setInputSurname(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="roomId"
                            label="Идентификатор комнаты"
                            name="roomId"
                            value={inputRoom}
                            onChange={e => setInputRoom(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            disabled={stateButtonRoom}
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => {joiningRoom(inputRoom, inputName, inputSurname)}}
                        >
                            Подключиться
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => {createNewRoom(inputName, inputSurname)}}
                        >
                            Создать новую комнату
                        </Button>
                        <Box
                        sx={{display: 'flex', justifyContent: 'space-between'}}
                        >
                            <Button
                                fullWidth
                                variant="contained"
                                color={colorMicrophoneButton.color}
                                sx={{ mt: 3, mb: 2, marginRight: '10px' }}
                                onClick={() => {setStateMicrophone(prev => !prev)}}
                            >
                                Микрофон
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                color={colorVideoButton.color}
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => {setStateVideo(prev => !prev)}}
                            >
                                Веб-камера
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default MainTemplateUI;