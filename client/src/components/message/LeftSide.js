import React, {useState, useEffect, useRef} from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { useHistory, useParams } from 'react-router-dom'
import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction'


const LeftSide = () => {

    const {authReducer, messageReducer, onlineReducer} = useSelector((state) => state)
    const dispatch = useDispatch();

    const [search, setSearch] = useState('')
    const [searchUsers, setSearchUsers] = useState([])

    const history = useHistory()
    const {id} = useParams()

    const pageEnd = useRef()
    const [page, setPage] = useState(0)

    const handleSearch = async(e) => {
        e.preventDefault()

        if(!search) return setSearchUsers([]);

        try {
            const res = await getDataAPI(`search?username=${search}`, authReducer.token)
            setSearchUsers(res.data.users)
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }

    const handleAddUser = (user) => {
        //console.log(user);
        setSearch('')
        setSearchUsers([])
        dispatch({type: MESS_TYPES.ADD_USER, payload: {...user, text: '', media: [] }})
        dispatch({
            type: MESS_TYPES.CHECK_ONLINE_OFFLINE,
            payload: onlineReducer
        })
        return history.push(`/message/${user._id}`)
    }

    const isActive = (user) => {
        if(id === user._id) return 'active'
        return ''
    }
    
    useEffect(() => {
        if(messageReducer.firstLoad) return;
        dispatch(getConversations({authReducer}))
    }, [dispatch, authReducer, messageReducer.firstLoad])

    //load more

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            //console.log(entries);
            if(entries[0].isIntersecting){
                setPage(p => p + 1)
            }
        },{
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    },[setPage])

    useEffect(() => {
        if(messageReducer.resultUsers >= (page - 1) * 9 && page > 1){
            dispatch(getConversations({authReducer, page}))
        }
    },[messageReducer.resultUsers, page, authReducer, dispatch])


    //checkUserOnlineOffline

    useEffect(() => {
        if(messageReducer.firstLoad) {
            dispatch({
                type: MESS_TYPES.CHECK_ONLINE_OFFLINE,
                payload: onlineReducer
            })
        }
    },[onlineReducer, messageReducer.firstLoad, dispatch])

    return (
        <>
            <form className="message_header" onSubmit={handleSearch}>
                <input type="text" value={search} 
                    placeholder="Search A Name..."
                    onChange={(e) => setSearch(e.target.value)} />
                <button type="submit" style={{display: 'none'}}>Search</button>
            </form>

            <div className="message_chat_list">
                {
                    searchUsers.length !== 0
                    ? <>
                        {
                            searchUsers.map((user) => (
                                <div key = {user._id} className={`message_user ${isActive(user)}`}
                                onClick={() => handleAddUser(user)}>
                                    <UserCard user={user}/>
                                </div>
                            ))
                        }
                        
                      </>
                    : <>

                        {
                            messageReducer.users.map((user) => (
                                <div key = {user._id} className={`message_user ${isActive(user)}`}
                                onClick={() => handleAddUser(user)}>
                                    <UserCard user={user} msg={true}>
                                        {
                                            user.onlineReducer
                                            ? <i className="fas fa-circle text-success " />
                                            : authReducer.user.following.find(item => 
                                                item._id === user._id
                                              ) && <i className="fas fa-circle" />
                                        }
                                        
                                    </UserCard>
                                </div>
                            ))
                        }
                        
                      </>
                }
               <button style={{opacity: 0}} ref={pageEnd}>Load more</button>
            </div>
        </>
    )
}

export default LeftSide
