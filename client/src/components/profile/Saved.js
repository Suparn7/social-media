import React, {useState, useEffect} from 'react'
import PostThumb from '../PostThumb'
import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'

const Saved = ({authReducer, dispatch}) => {
    const [savedPosts, setSavedPosts] = useState([])
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(2)
    const [load, setLoad] = useState(false)

    useEffect(() => {
       setLoad(true)
       getDataAPI('getSavedPosts', authReducer.token)
       .then((res) => {
           setSavedPosts(res.data.savePosts)
           //console.log(res)
           setResult(res.data.result)
           setLoad(false)
       })
       .catch((err) => {
           dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
       })

       //unmount after useEffect to reduce memory leaks
       return () => setSavedPosts([])
    },[authReducer.token, dispatch])

    const handleLoadMore = async() => {
        setLoad(true);
        const res = await getDataAPI(`getSavedPosts?limit=${page * 9}`, authReducer.token)
        
        setSavedPosts(res.data.savePosts)
        //console.log(res)
        setResult(res.data.result)
        setPage(page + 1)
        setLoad(false)
    }

    return (
        <div>
           <PostThumb posts={savedPosts} result={result}/>


            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }
            
                <LoadMoreBtn result={result} page={page} 
                load={ load } handleLoadMore={handleLoadMore} />
        </div>
    )
}

export default Saved
