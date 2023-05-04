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

    setVideoSwitch(state) {
        this.videoState = state
        console.log(this.videoState)
    }

    setMicrophoneSwitch(state) {
        this.microphoneState = state
        console.log(this.microphoneState)
    }


}

export default new stateMembersRoom()