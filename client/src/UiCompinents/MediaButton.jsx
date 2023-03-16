/*import React from 'react';
import useWebRTC from "../hooks/useWebRTC"
import {useState} from "react";

const MediaButton = ({roomID}) => {
    const {microphoneLocal, videoLocal, captureScreen} = useWebRTC();

    const [stateMic, setStateMic] = useState(true)
    const [stateVideo, setStateVideo] = useState(true)

    const microphoneChange = function(){
        microphoneLocal(stateMic)
        setStateMic(prev => !prev)
    }

    const videoChange = function(){
        videoLocal(stateVideo)
        setStateVideo(prev => !prev)
    }


    return (
        <div>
            <button onClick={microphoneChange}>Micro On/Off</button>
            <button onClick={videoChange}>Video On/Off</button>
            <button onClick={captureScreen}>CaptureScreen On/Off</button>
        </div>
    );
};

export default MediaButton;

 */