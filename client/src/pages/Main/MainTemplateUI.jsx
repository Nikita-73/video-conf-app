import {useState} from 'react';
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




const MainTemplateUI = ({joiningRoom, createNewRoom}) => {

    const [inputRoom, setInputRoom] = useState('')
    const [inputName, setInputName] = useState('')
    const [inputSurname, setInputSurname] = useState('')





    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random)',
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
                        Sign in
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                            value={inputName}
                            onChange={e => setInputName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                            value={inputSurname}
                            onChange={e => setInputSurname(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="roomId"
                            label="Room ID"
                            name="roomId"
                            value={inputRoom}
                            onChange={e => setInputRoom(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => {joiningRoom(inputRoom, inputName, inputSurname)}}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Connect
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => {createNewRoom(inputName, inputSurname)}}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create new room
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => {stateMembersRoom.setVideoSwitch()}}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Video
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => {stateMembersRoom.setMicrophoneSwitch()}}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Audio
                        </Button>

                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default MainTemplateUI;