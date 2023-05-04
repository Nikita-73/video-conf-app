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
    }

    setVideoSwitch(state) {
        this.videoState = state
    }


}

export default new stateMembersRoom()