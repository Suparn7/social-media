import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import noNoti from '../images/noNoti.png'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import moment from 'moment'
import { isReadNotify, NOTIFY_TYPES, deleteAllNotifies } from '../redux/actions/notifyAction'

const NotifyModal = () => {
    const {authReducer, notifyReducer} = useSelector((state) => state)
    const dispatch = useDispatch()

    const handleIsRead = (msg) => {
        //console.log(msg);
        dispatch(isReadNotify({msg, authReducer}));
    }
    

    const handleSound = () => {
        dispatch({type: NOTIFY_TYPES.UPDATE_SOUND, payload: !notifyReducer.sound})
    }

    const handleDeleteAll = () => {
        const newArr = notifyReducer.data.filter((item) => item.isRead === false)
        if(newArr.length === 0) return dispatch(deleteAllNotifies(authReducer.token))

        if(window.confirm(`You have ${newArr.length} unread notifications. Are you sure you want to delete all?`)){
            return dispatch(deleteAllNotifies(authReducer.token))
        }
    }
    
    return (
        <div style={{minWidth: '280px'}}>
            <div className="d-flex justify-content-between align-items-center px-3">
                <h3>Notifications</h3>
                {
                    notifyReducer.sound
                    ? <i className="fas fa-bell text-danger" style={{fontSize: '1.2rem', cursor: 'pointer'}} onClick={handleSound}/>
                    : <i className="fas fa-bell-slash text-danger" style={{fontSize: '1.2rem', cursor: 'pointer'}} onClick={handleSound} />
                }
            </div>
            <hr className="mt-0" />

            {
                notifyReducer.data.length === 0 &&
                <img src = {noNoti} alt="No New Notifications" className="w-100" />
            }

            <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto'}}>
                {
                    notifyReducer.data.map((msg,index) => (
                        <div key={index} className="px-2 mb-3">
                            <Link to={`${msg.url}`} className="d-flex text-dark align-items-center"
                            onClick={() => handleIsRead(msg)}>
                                <Avatar src={msg.user.avatar} size="big-avatar" />

                                <div className="mx-1 flex-fill">
                                    <div>
                                        <strong className="mr-1">{msg.user.username}</strong>
                                        <span>{msg.text}</span>
                                    </div>
                                    {msg.content && <small>{msg.content.slice(0,20)}...</small>}
                                </div>
                                <div style={{width: '30px'}}>
                                    {msg.image && <Avatar src={msg.image} size="medium-avatar" />}
                                </div>
                            </Link>
                            <small className="text-muted d-flex justify-content-between px-2">
                                {moment(msg.createdAt).fromNow()}
                                {
                                    !msg.isRead && <i className="fas fa-circle text-primary" />
                                }
                            </small>
                        </div>
                    ))
                }
            </div>

            <hr className="my-1" />
            <div className="text-right text-danger mr-2" style={{cursor: 'pointer'}}
            onClick={handleDeleteAll}>
                Delete All
            </div>
        </div>
    )
}

export default NotifyModal
