import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UserCard from '../UserCard'
import FollowBtn from '../FollowBtn'
import LoadIcon from '../../images/loading.gif'
import { getSuggestions } from '../../redux/actions/suggestionsAction'

const RightSideBar = () => {

    const {authReducer, suggestionsReducer} = useSelector((state) => state);
    const dispatch = useDispatch()

    return (
        <div className="mt-3">
            <UserCard user={authReducer.user} />

            <div className="d-flex justify-content-between align-items-center my-2">
                <h5 className="text-danger">Suggestions For You</h5>
                {
                    !suggestionsReducer.loading &&
                    <i className="fas fa-redo" style={{cursor: 'pointer'}}
                    onClick={() => dispatch(getSuggestions(authReducer.token))}/>
                }
                
            </div>

            {
                suggestionsReducer.loading
                ? <img src={LoadIcon} alt="Loading" className="d-block mx-auto my-4"/>
                : <div>
                    {
                        suggestionsReducer.users.map((user) => (
                            <UserCard key={user._id} user={user}>
                                <FollowBtn user={user}/>
                            </UserCard>
                        ))
                    }
                </div>
            }

            <div style={{opacity:'0.5'}}>
                <a href="http://linkedin.com/suparn7" target="_blank" rel="noreferrer"
                style={{wordBreak: 'break-all'}}>
                    linkedin
                </a>
                <small style={{display:'block'}}>
                    Made with love By Suparn
                </small>
                <small>
                    Under Mentorship of Dev A.T Vietnam
                </small>
                <small>
                    &copy; 2021 Social media from Suparn Kumar 
                </small>
            </div> 
            
        </div>
    )
}

export default RightSideBar
