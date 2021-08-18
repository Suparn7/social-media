import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import PostCard from '../PostCard'

import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { POST_TYPES } from '../../redux/actions/postAction'


const Posts = () => {
    const {postReducer, authReducer, themeReducer} = useSelector((state) => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    const handleLoadMore = async() => {
        setLoad(true);
        const res = await getDataAPI(`posts?limit=${postReducer.page * 9}`, authReducer.token)
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: {...res.data, page: postReducer.page + 1}
        })
        setLoad(false)
    }

    return (
        <div className="posts">
            {
                postReducer.posts.map((post) => (
                    <PostCard key ={post._id} post={post} themeReducer={themeReducer} />
                ))
            }

            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }
            
                <LoadMoreBtn result={postReducer.result} page={postReducer.page} 
                load={ load } handleLoadMore={handleLoadMore} />
        </div>
    )
}

export default Posts
