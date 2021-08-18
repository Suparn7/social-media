import React, {useState, useEffect, useRef, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Avatar from '../Avatar'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import {addMessage} from '../../redux/actions/messageAction'
import Ring from '../../audio/ringingbell.mp3'


const CallModal = () => {
    const {callReducer, authReducer, peerReducer, socketReducer, themeReducer} = useSelector(state => state)
    const dispatch = useDispatch()

    const [hours, setHours] = useState(0);
    const [mins, setMins] = useState(0)
    const [sec, setSec] = useState(0)
    const [total, setTotal] = useState(0)

    const [answer, setAnswer] = useState(false)
    const youVideo = useRef();
    const otherVideo = useRef()
    const [tracks, setTracks] = useState(null)
    const [newCall, setNewCall] = useState(null)

    //set Time

    useEffect(() => {
        const setTime = () => {
            setTotal(t => t + 1)
            setTimeout(setTime, 1000)
        }

        setTime()

        return () => setTotal(0)
    },[])

    useEffect(() => {
        setSec(total%60)
        setMins(parseInt(total/60))
        setHours(parseInt(total/3600))
    },[total])



    //end call

    const addCallMessage = useCallback((callReducer, times, disconnect) => {
        if(callReducer.recipient !== authReducer.user._id || disconnect){
            const msg = {
                sender: callReducer.sender,
                recipient: callReducer.recipient,
                text: '',
                media: [],
                call: {video: callReducer.video, times},
                createdAt: new Date().toISOString()
            }
            dispatch(addMessage({msg, authReducer, socketReducer}))
        }
    },[authReducer, dispatch,socketReducer ])

    const handleEndCall = () => {
        tracks && tracks.forEach(track => track.stop())
        if(newCall) newCall.close()
        let times = answer ? total : 0
        socketReducer.emit('endCall', {...callReducer, times})

        addCallMessage(callReducer, times)
        dispatch({type: GLOBALTYPES.CALL, payload: null})
    }

    useEffect(() => {
        if(answer){
            setTotal(0)
        }else{
            const timer = setTimeout(() => {
                
                socketReducer.emit('endCall', {...callReducer, times: 0})
                addCallMessage(callReducer, 0)
                dispatch({type: GLOBALTYPES.CALL, payload: null})
            },15000)
    
            return () => clearTimeout(timer)
        }
        
    },[dispatch, answer, callReducer, socketReducer, addCallMessage])

    useEffect(() => {
        socketReducer.on('endCallToClient', data => {
            //console.log(data);
            tracks && tracks.forEach(track => track.stop())
            if(newCall) newCall.close()
            addCallMessage(data, data.times)
            dispatch({type: GLOBALTYPES.CALL, payload: null})
        })

        return () => socketReducer.off('endCallToClient')
    },[socketReducer, dispatch, tracks, addCallMessage, newCall])


    //stream media

    const openStream = (video) => {
        const config = {audio: true, video}
        return navigator.mediaDevices.getUserMedia(config)
    }

    const playStream = (tag, stream) => {
        let video = tag;
        video.srcObject = stream;
        video.play()
    }

    //answercall
    const handleAnswer = () => {
        openStream(callReducer.video).then(stream => {
            playStream(youVideo.current, stream)
            const track = stream.getTracks();
            setTracks(track)

            const newCall = peerReducer.call(callReducer.peerId, stream);
            newCall.on('stream', function(remoteStream){
                playStream(otherVideo.current, remoteStream)
            })
            setAnswer(true)
            setNewCall(newCall)
        })
    }

    useEffect(() => {
        peerReducer.on('call', newCall => {
            openStream(callReducer.video).then(stream => {
                if(youVideo.current){
                    playStream(youVideo.current, stream)
                }

                const track = stream.getTracks();
                setTracks(track)

                newCall.answer(stream)
                newCall.on('stream', function(remoteStream){
                    if(otherVideo.current){
                        playStream(otherVideo.current, remoteStream)
                    }
                })
                setAnswer(true)
                setNewCall(newCall)
            })
        })

        return () => peerReducer.removeListener('call')
    },[peerReducer, callReducer.video])

    //disconnect

    useEffect(() => {
        socketReducer.on('callerDisconnect', () => {
            tracks && tracks.forEach(track => track.stop())
            if(newCall) newCall.close()
            
            dispatch({type: GLOBALTYPES.CALL, payload: null})

            let times = answer ? total : 0
            addCallMessage(callReducer, times, true)

            dispatch({
                type: GLOBALTYPES.ALERT, 
                payload: {error: `${callReducer.username} disconnected`}
            })
        })

        return () => socketReducer.off('callerDisconnect')
    },[socketReducer, tracks, dispatch, callReducer, addCallMessage,answer, total, newCall])


    //play-pause audio

    const playAudio = (newAudio) => {
        newAudio.play()
    }

    const pauseAudio = (newAudio) => {
        newAudio.pause()
        newAudio.currentTime = 0
    }

    useEffect(() => {
        let newAudio = new Audio(Ring)

        if(answer){
            pauseAudio(newAudio)
        }else{
            playAudio(newAudio)
        }

        return () => pauseAudio(newAudio)
    },[answer])

    return (
        <div className="call_modal">
            <div className="call_box" style={{
                display: (answer && callReducer.video) ? 'none' : 'flex'
            }}>
                <div className="text-center" style={{padding: '40px 0'}}>
                    <Avatar src={callReducer.avatar} size="super-avatar" />
                    <h4>{callReducer.username}</h4>
                    <h6>{callReducer.fullname}</h6>

                    {
                        answer
                        ?<div>
                            <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
                            <span>:</span>
                            <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                            <span>:</span>
                            <span>{sec.toString().length < 2 ? '0' + sec : sec}</span>
                        </div>
                        : <div>
                            {
                                callReducer.video
                                ? <span>Calling video...</span>
                                : <span>Calling audio...</span>
                            }
                          </div>
                    }
    
                </div>

                {
                    !answer && 
                    <div className="timer">
                        <small>{mins.toString().length < 2 ? '0' + mins : mins}</small>
                        <small>:</small>
                        <small>{sec.toString().length < 2 ? '0' + sec : sec}</small>
                    </div>
                }
                

                <div className="call_menu">
                    <button className="material-icons text-danger"
                    onClick={handleEndCall}>
                        call_end
                    </button>
                    {
                        (callReducer.recipient === authReducer.user._id && !answer) &&
                        <>
                        {
                            callReducer.video
                            ? <button className="material-icons text-success"
                            onClick={handleAnswer}>
                                videocam
                            </button>
                            : <button className="material-icons text-success"
                            onClick={handleAnswer}>
                                call
                            </button>
                        }
                        </>
                        }

                    
                </div>
            
                
            </div>

            <div className="show_video" style={{
                   opacity: ( answer && callReducer.video )? '1' : '0' ,
                   filter: themeReducer ? 'invert(1)': 'invert(0)'
            }}>
                <video ref={youVideo} className="you_video" playsInline muted/>
                <video ref={otherVideo} className="other_video" playsInline/>

                <div className="time_video">
                    <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
                    <span>:</span>
                    <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                    <span>:</span>
                    <span>{sec.toString().length < 2 ? '0' + sec : sec}</span>
                </div>

                <button className="material-icons text-danger end_call"
                onClick={handleEndCall}>
                    call_end
                </button>

            </div>
        </div>
    )
}

export default CallModal
