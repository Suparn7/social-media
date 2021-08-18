import React from 'react'
import Avatar from '../Avatar'
import { imageShow, videoShow } from '../../utils/mediaShow'
import { useSelector, useDispatch } from 'react-redux'
import { deleteMessages } from '../../redux/actions/messageAction'
import Times from './Times'

const MsgDisplay = ({user, msg, themeReducer, data}) => {
    const {authReducer} = useSelector((state) => state)
    const dispatch = useDispatch()

    const handleDeleteMessages = () => {
        //console.log('clicked');
        if(!data) return;
        
        if(window.confirm('Are you sure want to delete this message?')){
            dispatch(deleteMessages({msg, data, authReducer}))
        }
        
    }

    return (
        <>
            <div className="chat_title">
                <Avatar src={user.avatar} size="small-avatar" />
                <span>{user.username}</span>
            </div>

            <div className="you_content">
                {
                    user._id === authReducer.user._id && 
                    <i className="fas fa-trash text-danger" 
                    onClick={handleDeleteMessages}/>
                }
                
                <div>
                    {
                    msg.text && 
                    <div className="chat_text"
                    style={{filter: themeReducer? 'invert(1)': 'invert(0)'}}>
                        {msg.text}
                    </div>}

                    {
                        msg.media.map((item, index) => (
                            <div key={index}>
                                {
                                    item.url.match(/video/i)
                                    ? videoShow(item.url, themeReducer)
                                    : imageShow(item.url, themeReducer)
                                }
                            </div>
                        ))
                    }
                </div>
                
                {
                    msg.call &&
                    <button className="btn d-flex align-items-center py-3"
                    style={{background: '#eee', borderRadius: '10px'}}>
                        <span className="material-icons font-weight-bold mr-1"
                        style={{
                            fontSize:'2.5rem', color: msg.call.times === 0 ? 'crimson' : 'green',
                            filter: themeReducer ? 'invert(1)': 'invert(0)'
                        }}>
                            {
                                msg.call.times === 0
                                ? msg.call.video ? 'videocam_off' : 'phone_disabled'
                                : msg.call.video ? 'video_camera_front' : 'call'
                            }

                        </span>
                        <div className="text-left">
                            <h6>{msg.call.video ? 'video Call' : 'Audio Call'}</h6>
                            <small>
                                {
                                    msg.call.times > 0
                                    ? <Times total={ msg.call.times} />
                                    : new Date(msg.createdAt).toLocaleTimeString()
                                }
                            </small>
                        </div>
                    </button>
                }

            </div>

            

            <div className="chat_time">
                {new Date(msg.createdAt).toLocaleString()}
            </div>
        </>
    )
}

export default MsgDisplay
