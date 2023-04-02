import {useState} from 'react'
import socket from "../../socket";
import ACTIONS from '../../socket/actions';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import CancelIcon from '@mui/icons-material/Cancel';


const DrawerMemberUi = ({cartOpen, closeCart}) => {

    let showIcon = false

    const [stateMembersList, setStateMembersList] = useState([])


    if (stateMembersList[0]?.memberID === socket.id && stateMembersList[0]?.host === true) {
        showIcon = true
    }

    const handleRemoveMember = (item, newIndex) => {
        socket.emit(ACTIONS.HOST_REMOVE_MEMBER, {
            memberIDRemove: item.memberID
        })

        let newStateMembersList = stateMembersList.filter((_, index) => index === newIndex ? false : true)
        setStateMembersList(newStateMembersList)// надо чинить
    }





    socket.on(ACTIONS.SHARE_ROOM_MEMBERS, ({roomMembersList}) => {
        setStateMembersList(roomMembersList)

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
                {stateMembersList.map((item, index) => {
                    {if (showIcon === true) {
                        return (<ListItem key={item.memberID}>
                            <ListItemIcon>
                                <CancelIcon onClick={() => {handleRemoveMember(item, index)}}/>
                            </ListItemIcon>
                            <ListItemText primary={item.memberID} />
                        </ListItem>)
                    } else {
                        return (<ListItem key={item.memberID}>
                            <ListItemIcon>
                                <InboxIcon/>
                            </ListItemIcon>
                            <ListItemText primary={item.memberID} />
                        </ListItem>)
                    }}
                })}
            </List>
        </Drawer>
    )
};

export default DrawerMemberUi;