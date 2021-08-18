import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { createComment } from '../../redux/actions/commentAction';
import Icons from '../Icons'

const InputComment = ({children, post, onReply, setOnReply}) => {
    
    const [content, setContent] = useState('');
    const {authReducer, socketReducer, themeReducer} = useSelector((state) => state)
    const dispatch = useDispatch();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!content.trim()) {
            if(setOnReply) return setOnReply(false)
            return;
        }
        
        setContent('')
        const newComment = {
            content,
            likes: [],
            user: authReducer.user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        }

        
        dispatch(createComment({post, newComment, authReducer, socketReducer}))

        if(setOnReply) return setOnReply(false)

    }
    return (
        <form className="card-footer comment_input" onSubmit={handleSubmit}>
            {children}
            <input type="text" placeholder="Add Your Comments..."
            value={content} onChange={(e) => setContent(e.target.value)} 
            style={{
                filter: themeReducer ? 'invert(1)': 'invert(0)',
                color: themeReducer ? 'white' : '#111',
                background: themeReducer? 'rgba(0,0,0,0.3)' : ''
                }}/>

            <Icons setContent={setContent} content={content} themeReducer={themeReducer} />

            <button type="submit" className="postBtn">
                Post
            </button>
        </form>
    )
    
}

export default InputComment
