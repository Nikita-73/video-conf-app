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
    ADD_MEMBER: 'add-member',
    SHARE_ROOM_MEMBERS: 'share-room-members',
    HOST_REMOVE_MEMBER: 'host-remove-member',
    MEMBER_FORCED_DISCONNECTING: 'member-forced-disconnecting'
};

module.exports = ACTIONS;