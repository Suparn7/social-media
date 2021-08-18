import {GLOBALTYPES, DeleteData} from '../actions/globalTypes'
import {postDataAPI, getDataAPI, deleteDataAPI} from '../../utils/fetchData'

export const MESS_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_MESSAGES: 'DELETE_MESSAGES',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE'
}


export const addMessage = ({msg, authReducer, socketReducer}) => async(dispatch) => {
    //console.log(msg);
    dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})
    const {_id, avatar, fullname, username} = authReducer.user
    socketReducer.emit('addMessage', {...msg, user: {_id, avatar, fullname, username} })
    try {
        await postDataAPI('message', msg, authReducer.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload:{error: err.response.data.msg}})
    }
}

export const getConversations = ({authReducer, page = 1}) => async(dispatch) => {
    try {
        const res = await getDataAPI(`conversations?limit=${page*9}`, authReducer.token)
       // console.log(res);
        let newArr = [];
        res.data.conversations.forEach((item) => {
            item.recipients.forEach((cv) => {
                if(cv._id !== authReducer.user._id){
                    newArr.push({...cv, text: item.text, media: item.media, call: item.call})
                }
            })
        })

        //console.log(newArr);
        dispatch({
            type: MESS_TYPES.GET_CONVERSATIONS, 
            payload: {newArr, result: res.data.result}
        })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}

export const getMessages = ({authReducer, id, page = 1}) => async(dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, authReducer.token)
        //console.log(res);
        const newData = {...res.data, messages: res.data.messages.reverse()}
        //console.log(newData);
        dispatch({type: MESS_TYPES.GET_MESSAGES, payload: {...newData, _id: id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}

export const loadMoreMessages = ({authReducer, id, page = 1}) => async(dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, authReducer.token)
        //console.log(res);
        const newData = {...res.data, messages: res.data.messages.reverse()}
        //console.log(newData);
        dispatch({type: MESS_TYPES.UPDATE_MESSAGES, payload: {...newData, _id: id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
    }
}

export const deleteMessages = ({msg, data, authReducer}) => async(dispatch) => {
    //console.log({data});

    const newData = DeleteData(data, msg._id)
    //console.log({newData});
    dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload: {newData, _id: msg.recipient} })
    try {
        await deleteDataAPI(`message/${msg._id}`, authReducer.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteConversation = ({authReducer, id}) => async(dispatch) => {
    dispatch({type: MESS_TYPES.DELETE_CONVERSATION, payload: id})

    try {
        await deleteDataAPI(`conversation/${id}`, authReducer.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}