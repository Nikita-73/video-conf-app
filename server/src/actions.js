const ACTIONS = {
    JOIN: 'join',
    LEAVE: 'leave',
    SHARE_ROOMS: 'share-rooms',
    ADD_PEER: 'add-peer',
    REMOVE_PEER: 'remove-peer',
    RELAY_SDP: 'relay-sdp',
    RELAY_ICE: 'relay-ice',
    ICE_CANDIDATE: 'ice-candidate',
    SESSION_DESCRIPTION: 'session-description',
    HOST_ROOM: 'host-room',
    JOIN_ROOM: 'join-room',
    CALL_HOST: 'call-host',
    MEMBER_CONNECT: 'member_connect',
    MEMBER_PASS: 'member_pass',
    MEMBER_PASS_DONE: 'member_pass_done',
    WEBRTC_ON: 'webrtc-on'
};

module.exports = ACTIONS;