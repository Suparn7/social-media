import { GLOBALTYPES, EditData, DeleteData } from "./globalTypes";
import { POST_TYPES } from "./postAction";
import { postDataAPI, patchDataAPI, deleteDataAPI } from "../../utils/fetchData";
import {createNotify, removeNotify} from '../actions/notifyAction'

export const createComment = ({post, newComment, authReducer, socketReducer}) => async(dispatch) => {
    // console.log({post, newComment, authReducer})
    const newPost = {...post, comments: [...post.comments, newComment]}
    //console.log({post, newPost})

    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})

    try {
        const data= {...newComment, postId: post._id, postUserId: post.user._id}
        const res = await postDataAPI('comment', data, authReducer.token)

        const newData = {...res.data.newComment, user: authReducer.user}
        const newPost = {...post, comments: [...post.comments, newData]}
        dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})

        //socket

        socketReducer.emit('createComment', newPost)

        const msg = {
            id: res.data.newComment._id,
            text: newComment.reply ? 'mentioned you in a comment.' : 'commented on your post.',
            recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
            url: `/post/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }

        dispatch(createNotify({msg, authReducer, socketReducer}))


        
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload:{error: err.response.data.msg}})
    }
}

export const updateComment = ({comment, post, content, authReducer}) => async(dispatch) => {
    //console.log({comment, post, content, authReducer});
    const newComments = EditData(post.comments, comment._id, {...comment, content})
    const newPost = {...post, comments: newComments}
    // console.log(newPost)

    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})

    try {
        patchDataAPI(`comment/${comment._id}`, {content}, authReducer.token)

    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload:{error: err.response.data.msg}})
    }
}

export const likeComment = ({comment, post, authReducer}) => async(dispatch) => {
    const newComment = {...comment, likes: [...comment.likes, authReducer.user]}
    const newComments = EditData(post.comments, comment._id, newComment)
    const newPost = {...post, comments: newComments}

    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})

    try {
        await patchDataAPI(`comment/${comment._id}/like`, null, authReducer.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload:{error: err.response.data.msg}})
    }
}

export const unLikeComment = ({comment, post, authReducer}) => async(dispatch) => {
    const newComment = {...comment, likes: DeleteData(comment.likes, authReducer.user._id)}
    const newComments = EditData(post.comments, comment._id, newComment)
    const newPost = {...post, comments: newComments}

    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})

    try {
         await patchDataAPI(`comment/${comment._id}/unlike`, null, authReducer.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload:{error: err.response.data.msg}})
    }
}

export const deleteComment = ({post, authReducer, comment, socketReducer}) => async(dispatch) => {
    
    const deleteArr = [...post.comments.filter((cm) => cm.reply === comment._id), comment]
    const newPost = {
        ...post,
        comments: post.comments.filter((cm) => !deleteArr.find((da) => cm._id === da._id))
    }

    // console.log({newPost, post});

    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})

    socketReducer.emit('deleteComment', newPost)


    try {
        deleteArr.forEach((item) => {
            deleteDataAPI(`comment/${item._id}`, authReducer.token)

            const msg = {
                id: item._id,
                text: comment.reply ? 'mentioned you in a comment.' : 'commented on your post.',
                recipients: comment.reply ? [comment.tag._id] : [post.user._id],
                url: `/post/${post._id}`
            }
    
            dispatch(removeNotify({msg, authReducer, socketReducer}))
            
        })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload:{error: err.response.data.msg}})
    }

}