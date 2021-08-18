import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteComment } from '../../../redux/actions/commentAction'

const CommentMenu = ({post, comment, setOnEdit}) => {
    const {authReducer, socketReducer} = useSelector((state) => state)

    const dispatch = useDispatch()

    const handleRemove = () => {
        if(post.user._id === authReducer.user._id || comment.user._id === authReducer.user._id){
            dispatch(deleteComment({post, authReducer, comment, socketReducer}))
        }
    }



    const MenuItem = () => {
        return(
            <>
                <div className="dropdown-item" onClick={() => setOnEdit(true)}>
                    <span className="material-icons">create</span> Edit
                </div>

                <div className="dropdown-item" onClick={handleRemove}>
                    <span className="material-icons">delete_outline</span> Remove
                </div>
            </>
        )
    }
    return (
        <div className="menu">
            {
                (post.user._id === authReducer.user._id || comment.user._id === authReducer.user._id) &&
                <div className="nav-item dropdown">
                    <span className="material-icons" id="moreLink" data-toggle="dropdown">
                        more_vert
                    </span>

                    <div className="dropdown-menu" aria-labelledby="moreLink">
                        {
                            post.user._id === authReducer.user._id
                            ? comment.user._id === authReducer.user._id
                                ? MenuItem()
                                : <div className="dropdown-item" onClick={handleRemove}>
                                    <span className="material-icons">delete_outline</span> Remove
                                </div>
                            : comment.user._id === authReducer.user._id && MenuItem()
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default CommentMenu
