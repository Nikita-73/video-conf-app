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
    REMOVE_MEMBER: 'remove-member',
    DISCONNECTING_MEMBER: 'disconnecting-member',
    MEMBER_FORCED_DISCONNECTING: 'member-forced-disconnecting',
    MEMBER_CLEAN_LIST: 'member-clean-list'
};

module.exports = ACTIONS;