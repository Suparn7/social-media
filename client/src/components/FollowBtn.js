import React,{useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { follow, unfollow } from '../redux/actions/profileAction';

const FollowBtn = ({user}) => {

    const [followed, setFollowed] = useState(false)

    const {authReducer, profileReducer, socketReducer} = useSelector((state) => state)
    const dispatch = useDispatch()

    const[load, setLoad] = useState(false);

    useEffect(() => {
       if(authReducer.user.following.find((item) => item._id === user._id)){
           setFollowed(true)
       }

       return () => setFollowed(false)
    }, [authReducer.user.following,user._id])

    const handleFollow = async() => {
        if(load) return;

        setFollowed(true)
        setLoad(true);
        await dispatch(follow({users: profileReducer.users, user, authReducer, socketReducer}))
        setLoad(false)
    }

    const handleUnFollow = async() => {
        if(load) return;

        setFollowed(false)
        setLoad(true);
        await dispatch(unfollow({users: profileReducer.users, user, authReducer, socketReducer}))
        setLoad(false);
    }

    return (
        <>
        {
            followed
            ? <button className="btn btn-outline-danger" onClick={handleUnFollow}>
                UnFollow
              </button>
            : <button className="btn btn-outline-info" onClick={handleFollow}>
                Follow
              </button>
        }
        </>
    )
}

export default FollowBtn
