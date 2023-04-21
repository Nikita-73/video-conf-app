import {useState} from 'react'
import socket from "../../socket";
import ACTIONS from '../../socket/actions';
import {useParams} from "react-router";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import CancelIcon from '@mui/icons-material/Cancel';
import stateMembersRoom from '../../store/stateMembersRoom'


const DrawerMemberUi = ({cartOpen, closeCart}) => {

    let showIcon = false

    const {id: roomID} = useParams();

    const [stateMembersList, setStateMembersList] = useState([])


    if (stateMembersList[0]?.memberID === socket.id && stateMembersList[0]?.host === true) {
        showIcon = true
    }

    const handleRemoveMember = (item) => {
        socket.emit(ACTIONS.REMOVE_MEMBER, {
            membersList: stateMembersList,
            memberIDRemove: item.memberID,
        })
    }

    socket.on(ACTIONS.MEMBER_FORCED_DISCONNECTING, ({memberIDRemove}) => {
        if (socket.id === memberIDRemove){
            socket.emit(ACTIONS.LEAVE)
            socket.emit(ACTIONS.MEMBER_CLEAN_LIST, {
                memberIDRoom: roomID,
                memberID: memberIDRemove
            })
        }

        setStateMembersList(prev => prev.filter(item => item.memberID !== memberIDRemove))
        stateMembersRoom.setStateList(stateMembersList)
    })


    socket.on(ACTIONS.SHARE_ROOM_MEMBERS, ({roomMembersList}) => {
        setStateMembersList(roomMembersList)
        stateMembersRoom.setStateList(roomMembersList)
    })






    return (
        <Drawer
            anchor="right"
            open={cartOpen}
            onClose={closeCart}
        >
            <List sx={{width: '400px'}}>
                <ListItem>
                    <ListItemText primary="Участники конференции" />
                </ListItem>
                {stateMembersList.map((item) => {
                    {if (showIcon === true) {
                        return (<ListItem key={item.memberID}>
                            <ListItemIcon>
                                <CancelIcon onClick={() => {handleRemoveMember(item)}}/>
                            </ListItemIcon>
                            <ListItemText primary={`${item.name} ${item.surname}`} />
                        </ListItem>)
                    } else {
                        return (<ListItem key={item.memberID}>
                            <ListItemIcon>
                                <InboxIcon/>
                            </ListItemIcon>
                            <ListItemText primary={`${item.name} ${item.surname}`} />
                        </ListItem>)
                    }}
                })}
            </List>
        </Drawer>
    )
};

export default DrawerMemberUi;

//let newStateMembersList = stateMembersList.filter((_, index) => index === newIndex ? false : true)
// setStateMembersList(newStateMembersList)// надо чинить