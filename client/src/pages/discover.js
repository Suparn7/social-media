import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getDiscoverPosts, DISCOVER_TYPES} from '../redux/actions/discoverAction'
import LoadIcon from '../images/loading.gif'
import PostThumb from '../components/PostThumb'
import LoadMoreBtn from '../components/LoadMoreBtn'
import { getDataAPI } from '../utils/fetchData'


const Discover = () => {
    const {authReducer, discoverReducer} = useSelector((state) => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    useEffect(() => {
        if(!discoverReducer.firstLoad){
            dispatch(getDiscoverPosts(authReducer.token))
        }
    },[dispatch, authReducer.token, discoverReducer.firstLoad])


    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`post_discover?num=${discoverReducer.page * 9}`, authReducer.token)
        dispatch({type: DISCOVER_TYPES.UPDATE_POST, payload: res.data})
        setLoad(false)
    }

    return (
        <div>
            {
               discoverReducer.loading
               ? <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
               : <PostThumb posts={discoverReducer.posts} result={discoverReducer.result} />
            }

            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }
            
            {
                !discoverReducer.loading &&
                <LoadMoreBtn result={discoverReducer.result} page={discoverReducer.page} 
                load={ load } handleLoadMore={handleLoadMore} />
            }
            
        </div>
    )
}

export default Discover
