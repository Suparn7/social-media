import React, {useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { POST_TYPES } from './redux/actions/postAction'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import { NOTIFY_TYPES } from './redux/actions/notifyAction'
import { MESS_TYPES } from './redux/actions/messageAction'
import audiobell from './audio/audiobell.mp3'

const spawnNotification = (body, icon, url, title) => {
    let options = {
        body, icon
    }

    let n = new Notification(title, options)

    n.onclick = (e) => {
        e.preventDefault()
        window.open(url, '_blank')
    }
}

const SocketClient = () => {
    const {authReducer, socketReducer, notifyReducer, onlineReducer, callReducer} = useSelector((state) => state)
    const dispatch = useDispatch();

    const audioRef = useRef()

    //joinuser
    useEffect(() => {
        socketReducer.emit('joinUser', authReducer.user)
    },[socketReducer, authReducer.user])
    
    //likes
    useEffect(() => {
        socketReducer.on('likeToClient', (newPost) => {
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

        return () => socketReducer.off('likeToClient')

    },[socketReducer, dispatch])

    useEffect(() => {
        socketReducer.on('unLikeToClient', (newPost) => {
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

        return () => socketReducer.off('unLikeToClient')

    },[socketReducer, dispatch])

    //comments
    useEffect(() => {
        socketReducer.on('createCommentToClient', (newPost) => {
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

        return () => socketReducer.off('createCommentToClient')

    },[socketReducer, dispatch])

    useEffect(() => {
        socketReducer.on('deleteCommentToClient', (newPost) => {
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

        return () => socketReducer.off('deleteCommentToClient')

    },[socketReducer, dispatch])

    //follow
    useEffect(() => {
        socketReducer.on('followToClient', (newUser) => {
            dispatch({type: GLOBALTYPES.AUTH, payload: {...authReducer, user: newUser}})
        })

        return () => socketReducer.off('followToClient')

    },[socketReducer, dispatch, authReducer])
    
    useEffect(() => {
        socketReducer.on('unFollowToClient', (newUser) => {
            dispatch({type: GLOBALTYPES.AUTH, payload: {...authReducer, user: newUser}})
        })

        return () => socketReducer.off('unFollowToClient')

    },[socketReducer, dispatch, authReducer])

    //Notifications
    useEffect(() => {
        socketReducer.on('createNotifyToClient', (msg) => {
            dispatch({type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg})
            if(notifyReducer.sound) audioRef.current.play()
            spawnNotification(
                msg.user.username + ' ' + msg.text,
                msg.user.avatar,
                msg.url,
                'SOCIAL_MEDIA'
            )
        })

        return () => socketReducer.off('createNotifyToClient')

    },[socketReducer, dispatch, notifyReducer.sound])

    useEffect(() => {
        socketReducer.on('removeNotifyToClient', (msg) => {
            console.log(msg);
            dispatch({type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg})
        })

        return () => socketReducer.off('removeNotifyToClient')

    },[socketReducer, dispatch])


    //Message

    useEffect(() => {
        socketReducer.on('addMessageToClient', (msg) => {
            //console.log(msg);
            dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})
            //console.log(msg)
            dispatch({
                type: MESS_TYPES.ADD_USER, 
                payload: {
                    ...msg.user, 
                    text: msg.text, 
                    media: msg.media 
            }
        })

        })

        return () => socketReducer.off('addMessageToClient')

    },[socketReducer, dispatch])

    //check user online or offline

    useEffect(() => {
        socketReducer.emit('checkUserOnline', authReducer.user)
    },[socketReducer, authReducer.user])
    


    useEffect(() => {
        socketReducer.on('checkUserOnlineToMe', (data) => {
            //console.log(data);
            
            data.forEach((item) => {
                if(!onlineReducer.includes(item.id)){
                    dispatch({type: GLOBALTYPES.ONLINE, payload: item.id})
                }
            })
        })

        return () => socketReducer.off('checkUserOnlineToMe')

    },[socketReducer, dispatch, onlineReducer])




    useEffect(() => {
        socketReducer.on('checkUserOnlineToClient', (id) => {
            if(!onlineReducer.includes(id)){
                dispatch({type: GLOBALTYPES.ONLINE, payload: id})
            }
   
        })

        return () => socketReducer.off('checkUserOnlineToClient')

    },[socketReducer, dispatch, onlineReducer])


    //check userOffline

    useEffect(() => {
        socketReducer.on('checkUserOffline', (id) => {
            //console.log(id);
            dispatch({type: GLOBALTYPES.OFFLINE, payload:id})
        })

        return () => socketReducer.off('checkUserOffline')

    },[socketReducer, dispatch])

    //callUser

    useEffect(() => {
        socketReducer.on('callUserToClient', data => {
            //console.log(data);
            dispatch({type: GLOBALTYPES.CALL, payload: data})
        })

        return () => socketReducer.off('callUserToClient')

    },[socketReducer, dispatch])

    useEffect(() => {
        socketReducer.on('userBusy', data => {
            //console.log(data);
            dispatch({type: GLOBALTYPES.ALERT, payload: {error: `${callReducer.username} is Busy`}})
        })

        return () => socketReducer.off('userBusy')

    },[socketReducer, dispatch, callReducer])





    return (
        <>
            <audio controls ref={audioRef} style={{display: 'none'}}>
                <source src={audiobell} type="audio/mp3" />
            </audio>
    
        </>
    )
}

export default SocketClient
