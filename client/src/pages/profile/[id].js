import React, {useState,useEffect} from 'react'

import Info from '../../components/profile/Info'
import Posts from '../../components/profile/Posts'
import Saved from '../../components/profile/Saved'

import { getProfileUsers } from '../../redux/actions/profileAction'
import { useSelector, useDispatch } from 'react-redux'
import LoadIcon from '../../images/loading.gif'
import { useParams } from 'react-router-dom'

const Profile = () => {

    const {profileReducer, authReducer} = useSelector((state) => state)
    const dispatch = useDispatch();
    const {id} = useParams()

    const [savedTab, setSavedTab] = useState(false)

    useEffect(() => {
        if(profileReducer.ids.every((item) => item !== id)){
            dispatch(getProfileUsers({id, authReducer}))
        }
    },[id, authReducer, dispatch, profileReducer.ids])

    return (
        <div className="profile">

            <Info authReducer={authReducer} profileReducer={profileReducer} dispatch={dispatch} id={id} />
            
            {
                authReducer.user._id === id &&
                <div className="profile_tab">
                    <button className={savedTab ? '' : 'active'}onClick={() => setSavedTab(false)}>Posts</button>
                    <button className={savedTab ? 'active' : ''}onClick={() => setSavedTab(true)}>Saved</button>
                </div>
            }

            {
                profileReducer.loading 
                ? <img className="d-block mx-auto my-4" src={LoadIcon} alt="Loading" />
                : <>
                    {
                        savedTab 
                        ? <Saved authReducer={authReducer} dispatch={dispatch} />
                        : <Posts authReducer={authReducer} profileReducer={profileReducer} dispatch={dispatch} id={id} />
                    }
                </>
            }
          
           
        </div>
    )
}

export default Profile
