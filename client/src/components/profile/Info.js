import React, { useState,useEffect } from 'react'

import Avatar from '../Avatar'

import EditProfile from './EditProfile';
import FollowBtn from '../FollowBtn';
import Followers from './Followers';
import Following from './Following';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const Info = ({id, profileReducer, authReducer, dispatch}) => {

    const [userData, setUserData] = useState([]);
    const [onEdit, setonEdit] = useState(false);

    const[showFollowers, setShowFollowers] = useState(false)
    const[showFollowing, setShowFollowing] = useState(false)


    useEffect(() => {
      if(id === authReducer.user._id){
        setUserData([authReducer.user])
      }else{
        
        const newData = profileReducer.users.filter((user) => user._id === id)
        setUserData(newData)
      } 

    }, [id,authReducer, dispatch, profileReducer.users])

    useEffect(() => {
        if(showFollowers || showFollowing || onEdit){
            dispatch({type: GLOBALTYPES.MODAL, payload: true})
        }else{
            dispatch({type: GLOBALTYPES.MODAL, payload: false})
        }
    },[showFollowers,showFollowing,onEdit, dispatch])

    return (
        <div className="info">
            
            {
                userData.map((user)=>(
                    <div className="info_container" key={user._id}>
                        <Avatar src={user.avatar} size="super-avatar"/>

                        <div className="info_content">

                            <div className="info_content_title">
                                <h2>{user.username}</h2>
                                {
                                    user._id === authReducer.user._id
                                    ? <button 
                                    onClick={() => setonEdit(true)} 
                                    className="btn btn-outline-info">Edit Profile</button>
                                    : <FollowBtn user={user} />
                                }
                            </div>

                            <div className="follow_btn">
                                <span className="mr-4" onClick={() => setShowFollowers(true)}>
                                    {user.followers.length} Followers
                                </span>

                                <span className="ml-4" onClick={() => setShowFollowing(true)}>
                                    {user.following.length} Following
                                </span>
                            </div>
                            <h6>{user.fullname} <span className="text-danger">{user.mobile}</span></h6>
                            <p className="m-0">{user.address}</p>
                            <h6 className="m-0">{user.email}</h6>
                            <a href={user.website} target="_blank" rel="noreferrer">
                                {user.website}
                            </a>
                            <p>{user.story}</p>
                        </div>

                    {
                        onEdit && <EditProfile  setonEdit={setonEdit} />
                    }

                    {
                        showFollowers &&
                        <Followers users={user.followers} setShowFollowers={setShowFollowers} />
                    }

                    {
                        showFollowing &&
                        <Following users={user.following} setShowFollowing={setShowFollowing} />
                    }

                    </div>
                ))
            }
        </div>
    )
}

export default Info
