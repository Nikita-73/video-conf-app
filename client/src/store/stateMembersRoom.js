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

    setMicrophoneSwitch(state) {
        this.microphoneState = state
        console.log(this.microphoneState)
    }

    setVideoSwitch(state) {
        this.videoState = state
        console.log(this.videoState)
    }


}

export default new stateMembersRoom()