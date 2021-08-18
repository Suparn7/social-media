import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getPost } from '../../redux/actions/postAction'
import LoadIcon from '../../images/loading.gif'
import PostCard from '../../components/PostCard'

const Post = () => {
    const {id} = useParams()
    const [post, setPost] = useState([])

    const {authReducer, detailPostReducer} = useSelector((state) => state)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPost({detailPostReducer, id, authReducer}))

        if(detailPostReducer.length > 0){
            const newArr = detailPostReducer.filter((post) => post._id === id)
            setPost(newArr)
        }
    },[detailPostReducer, dispatch, id, authReducer])

    return (
        <div className="posts">
           {
               post.length === 0 &&
               <img src={LoadIcon} alt="Loading" className="d-block mx-auto my-4"/>
           }

           {
               post.map((item) => (
                    <PostCard key={item._id} post={item} />
               ))
           }
        </div>
    )
}

export default Post
