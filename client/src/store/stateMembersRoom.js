import {makeAutoObservable} from 'mobx'



class stateMembersRoom {
    listMembers = []
    videoState = true
    microphoneState = true

    constructor() {
        makeAutoObservable(this)
    }

    setStateList(list) {
        this.listMembers = list
    }

    setVideoSwitch() {
        this.videoState = false
        console.log(this.videoState)
    }

    setMicrophoneSwitch() {
        this.microphoneState = false
        console.log(this.microphoneState)
    }


}

export default new stateMembersRoom()