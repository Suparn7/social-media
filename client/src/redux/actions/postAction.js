import { GLOBALTYPES } from "./globalTypes"
import {imageUpload} from '../../utils/imageUpload'
import {postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI} from '../../utils/fetchData'
import { createNotify, removeNotify } from "./notifyAction"

export const POST_TYPES = {
    CREATE_POST: 'CREATE_POST',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST'
}

export const createPost = ({content, images, authReducer, socketReducer}) => async(dispatch) => {
    let media = [];
    try {
        
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})

        if(images.length > 0){
            media = await imageUpload(images)
        }
        const res = await postDataAPI('posts', {content, images: media}, authReducer.token)
        
        dispatch({
            type: POST_TYPES.CREATE_POST, 
            payload: {...res.data.newPost, user: authReducer.user}
        })

        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: false}})

        //console.log(res);
        //Notify
        const msg = {
            id: res.data.newPost._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${res.data.newPost._id}`,
            content, 
            image: media[0].url
        }

        dispatch(createNotify({msg, authReducer, socketReducer}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getPosts = (token) => async(dispatch) => {
    try {
        dispatch( {type: POST_TYPES.LOADING_POST, payload:true})
        const res = await getDataAPI('posts',token)
        

        dispatch({
            type:POST_TYPES.GET_POSTS,
            payload: {...res.data, page: 2}
        })

        dispatch( {type: POST_TYPES.LOADING_POST, payload:false})
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const updatePost = ({content, images, authReducer, statusReducer}) => async(dispatch) => {
    let media = [];
    const imgNewUrl = images.filter((img) => !img.url);
    const imgOldUrl = images.filter((img) => img.url);

    if(statusReducer.content === content
        && imgNewUrl.length === 0
        && imgOldUrl.length === statusReducer.images.length
        ) return;
    try {
        
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})

        if(imgNewUrl.length > 0){
            media = await imageUpload(imgNewUrl)
        }
        const res = await patchDataAPI(`post/${statusReducer._id}`, {
            content, images: [...imgOldUrl, ...media]
        }, authReducer.token)
        
        dispatch({type: POST_TYPES.UPDATE_POST, payload: res.data.newPost})

        dispatch({type: GLOBALTYPES.ALERT, payload: {success: res.data.msg}})

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const likePost = ({post, authReducer, socketReducer}) => async(dispatch) => {
    
    const newPost = {...post, likes:[...post.likes, authReducer.user]}
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
    socketReducer.emit('likePost', newPost)

    try {

        await patchDataAPI(`post/${post._id}/like`, null, authReducer.token)
        
        const msg = {
            id: authReducer.user._id,
            text: 'liked your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }

        dispatch(createNotify({msg, authReducer, socketReducer}))

    
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unLikePost = ({post, authReducer, socketReducer}) => async(dispatch) => {
    
    const newPost = {...post, likes: post.likes.filter((like) => like._id !== authReducer.user._id)}
    
    
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
    socketReducer.emit('unLikePost', newPost)

    try {

        await patchDataAPI(`post/${post._id}/unlike`, null, authReducer.token)
        
        const msg = {
            id: authReducer.user._id,
            text: 'liked your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
        }

        dispatch(removeNotify({msg, authReducer, socketReducer}))
    
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getPost = ({detailPostReducer, id, authReducer}) => async(dispatch) => {
    //console.log({detailPostReducer, id})
    if(detailPostReducer.every((post) => post._id !== id )){
        
        try {
           const res = await getDataAPI(`post/${id}`, authReducer.token) 
           dispatch({type: POST_TYPES.GET_POST, payload: res.data.post})
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }
} 

export const deletePost = ({post, authReducer, socketReducer}) => async(dispatch) => {
    // console.log({post, authReducer})
    dispatch({type: POST_TYPES.DELETE_POST, payload: post})

    try {
        const res = await deleteDataAPI(`post/${post._id}`, authReducer.token)

        const msg = {
            id: post._id,
            text: 'added a new post',
            recipients: res.data.newPost.user.followers,
            url: `/post/${post._id}`,
            
        }

        dispatch(removeNotify({msg, authReducer, socketReducer}))
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const savePost = ({post, authReducer}) => async(dispatch) => {
   //console.log({post, authReducer})
//    console.log(typeof authReducer.user.saved);
   
   const newUser = {...authReducer.user, saved:[...authReducer.user.saved, post._id]}
   dispatch({type: GLOBALTYPES.AUTH, payload: {...authReducer, user: newUser}})

   try {
       await patchDataAPI(`savePost/${post._id}`, null, authReducer.token )
   } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
   }
}

export const unSavePost = ({post, authReducer}) => async(dispatch) => {
    //console.log({post, authReducer})
 //    console.log(typeof authReducer.user.saved);
    
    const newUser = {...authReducer.user, saved: authReducer.user.saved.filter((id) => id !== post._id)}
    dispatch({type: GLOBALTYPES.AUTH, payload: {...authReducer, user: newUser}})
 
    try {
        await patchDataAPI(`unSavePost/${post._id}`, null, authReducer.token )
    } catch (err) {
         dispatch({
             type: GLOBALTYPES.ALERT,
             payload: {error: err.response.data.msg}
         })
    }
}