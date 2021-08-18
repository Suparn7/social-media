import React, {useState, useEffect, useRef} from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import MsgDisplay from './MsgDisplay'
import Icons from '../Icons'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import {imageShow, videoShow} from '../../utils/mediaShow'
import {imageUpload} from '../../utils/imageUpload'
import { addMessage, getMessages, loadMoreMessages, deleteConversation } from '../../redux/actions/messageAction'
import LoadIcon from '../../images/loading.gif'

const RightSide = () => {
    const {authReducer, messageReducer, themeReducer, socketReducer, peerReducer} = useSelector((state) => state)
    const dispatch = useDispatch()

    const {id} = useParams()
    const [user, setUser] = useState([])
    const [text, setText] = useState('')
    const [media, setMedia] = useState([])
    const [loadMedia, setLoadMedia] = useState(false)

    const refDisplay = useRef()
    const pageEnd = useRef()

    const [data, setData] = useState([])
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(0)
    const [isLoadMore, setIsLoadMore] = useState(0)

    const history = useHistory()

    useEffect(() => {
        const newData = messageReducer.data.find((item) => item._id === id)
        //console.log(newData);
        if(newData){
            setData(newData.messages)
            setResult(newData.result)
            setPage(newData.page)
        }
    },[messageReducer.data, id])

    useEffect(() => {
        if(id && messageReducer.users.length > 0){
            setTimeout(()=> {
                refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
            },50)

            const newUser = messageReducer.users.find((user) => user._id === id)
            if(newUser){
                setUser(newUser)
                
            }
        }
        
    },[messageReducer.users, id])

    const handleChangeMedia = (e) => {
        const files = [...e.target.files]
        let err = "";
        let newMedia = [];

        files.forEach((file) => {
            if(!file) return err = "File Doesn't Exist."

            if(file.size > 1024 * 1024 * 5){
                return err = "File Size upto 5 mb allowed"
            }

            return newMedia.push(file)
        })

        if(err) dispatch({type: GLOBALTYPES.ALERT, payload:{error: err}})
        setMedia([...media, ...newMedia]);
    }

    const handleDeleteMedia = (index) => {
        const newArr = [...media];
        newArr.splice(index,1)
        setMedia(newArr)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!text.trim && media.length === 0) return;
        setText('')
        setMedia([])
        setLoadMedia(true)

        let newArr = [];

        if(media.length > 0) newArr = await imageUpload(media)

        const msg = {
            sender: authReducer.user._id,
            recipient: id,
            text,
            media: newArr,
            createdAt: new Date().toISOString()
        }

        setLoadMedia(false)
        await dispatch(addMessage({msg, authReducer, socketReducer}))

        if(refDisplay.current){
            refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
        }

    }

    useEffect(() => { 
        
            const getMessagesData = async() => {

                if(messageReducer.data.every((item) => item._id !== id)){
                    await dispatch(getMessages({authReducer, id}))
                
                    setTimeout(()=> {
                        refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
                    },50)
                }
                
            }

            getMessagesData()

    },[id, dispatch, authReducer, messageReducer.data])

    //LoadMore

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            //console.log(entries);
            if(entries[0].isIntersecting){
                setIsLoadMore(p => p + 1)
            }
        },{
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    },[setIsLoadMore])

    useEffect(() => {
        if(isLoadMore > 1){
            if(result >= page*9){
                dispatch(loadMoreMessages({authReducer, id, page:page+1}))
                setIsLoadMore(1)
            }
        }
        // eslint-disable-next-line
    },[isLoadMore])


    const handleDeleteConversation = () => {
        if(window.confirm('Are you sure want to delete your conversation?')){
            dispatch(deleteConversation({authReducer, id}))
            return history.push('/message')
        }
        //console.log(id);
        
    }
    //callAndVideo

    const caller = ({video}) => {
        const {_id, avatar, username, fullname} = user

        const msg = {
            sender: authReducer.user._id,
            recipient: _id,
            avatar, username, fullname, video
        }

        dispatch({type: GLOBALTYPES.CALL, payload: msg})
    }

    const callUser = ({video}) => {
        const {_id, avatar, username, fullname} = authReducer.user

        const msg = {
            sender: _id,
            recipient: user._id,
            avatar, username, fullname, video
        }

        if(peerReducer.open) msg.peerId = peerReducer._id

        socketReducer.emit('callUser', msg)
    }

    //call
    const handleAudioCall = () => {
        caller({video: false})
        callUser({video: false})
    }

    //video
    const handleVideoCall = () => {
        caller({video: true})
        callUser({video: true})
    }

    return (
        <>
            <div className="message_header" style={{cursor: 'pointer'}}>
                {
                    user.length !== 0 &&
                    <UserCard user={user}>
                        <div>
                            <i className="fas fa-phone-alt"
                            onClick={handleAudioCall} />

                            <i className="fas fa-video mx-3"
                            onClick={handleVideoCall} />

                            <i className="fas fa-trash text-danger"
                            onClick={handleDeleteConversation} />
                        </div>
                    </UserCard>
                }
            </div>

            <div className="chat_container"
            style={{height: media.length > 0 ? 'calc(100% - 180px)': ''}}>
                <div className="chat_display" ref={refDisplay}>
                    <button style={{marginTop: '-20px', opacity: 0}} ref={pageEnd}>
                        Load more
                    </button>
                    
                    {
                        data.map((msg, index) => (
                            <div key={index}>
                                {
                                    msg.sender !== authReducer.user._id &&
                                    <div className="chat_row other_message">
                                        <MsgDisplay user={user} msg={msg} themeReducer={themeReducer} data={data} />
                                    </div>
                                }

                                {
                                    msg.sender === authReducer.user._id &&
                                    <div className="chat_row you_message">
                                        <MsgDisplay user={authReducer.user} msg={msg} themeReducer={themeReducer} data={data} />
                                    </div>
                                }
                            </div>
                        ))
                    }
                    
                    {
                       loadMedia && 
                       <div className="chat_row you_message" >
                           <img src={LoadIcon} alt="loading" />
                       </div> 
                    }

                </div>
            </div>

            <div className="show_media" style={{display: media.length > 0 ? 'grid': 'none'}}>
                {
                    media.map((item, index) => (
                        <div key={index} id="file_media">
                            {
                                item.type.match(/video/i)
                                ? videoShow(URL.createObjectURL(item),themeReducer)
                                : imageShow(URL.createObjectURL(item),themeReducer)
                            }
                            <span onClick={() => handleDeleteMedia(index)}>&times;</span>
                        </div>
                    ))
                }
            </div>

            <form className="chat_input" onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter your message" 
                value={text} onChange={(e) => setText(e.target.value)}
                style={{
                    filter: themeReducer? 'invert(1)': 'invert(0)',
                    background: themeReducer ? '#040404' : '',
                    color: themeReducer ? 'white' : ''
                    }}/>
                
                <Icons setContent={setText} content={text} themeReducer={themeReducer} />

                <div className="file_upload">
                    <i className="fas fa-image text-danger" />
                    <input type="file" name="file" id="file"
                    multiple accept="image/*, video/*" onChange={handleChangeMedia} />
                </div>
                <button type="submit" className="material-icons" 
                disabled={(text || media.length > 0) ? false : true}>
                    near_me
                </button>
            </form>
        </>
    )
}

export default RightSide
