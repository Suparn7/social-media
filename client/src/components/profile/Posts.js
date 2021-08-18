import React, {useState, useEffect} from 'react'
import PostThumb from '../PostThumb'
import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { PROFILE_TYPES } from '../../redux/actions/profileAction'

const Posts = ({authReducer, id, dispatch, profileReducer}) => {
    const [posts, setPosts] = useState([])
    const [result, setResult] = useState(0)
    const [page, setPage] = useState(0)
    const [load, setLoad] = useState(false)

    useEffect(() => {
        profileReducer.posts.forEach((data) => {
            if(data._id === id){
                setPosts(data.posts)
                setResult(data.result)
                setPage(data.page)
            }
        })
    },[profileReducer.posts, id])

    const handleLoadMore = async() => {
        setLoad(true);
        const res = await getDataAPI(`user_posts/${id}?limit=${page * 9}`, authReducer.token)
        const newData = {...res.data, page: page + 1, _id: id}
        console.log(newData);
        dispatch({type: PROFILE_TYPES.UPDATE_POST, payload: newData})
        setLoad(false)
    }

    return (
        <div>
           <PostThumb posts={posts} result={result}/>


            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }
            
                <LoadMoreBtn result={result} page={page} 
                load={ load } handleLoadMore={handleLoadMore} />
        </div>
    )
}

export default Posts
