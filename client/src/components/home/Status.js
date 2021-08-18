import React from 'react'
import Avatar from '../Avatar'
import { useSelector,useDispatch } from 'react-redux'
import {GLOBALTYPES} from '../../redux/actions/globalTypes'

const Status = () => {
    const {authReducer} = useSelector((state) => state)
    const dispatch = useDispatch()

    return (
        <div className="status my-3 d-flex">
            <Avatar src={authReducer.user.avatar} size="big-avatar" />
            
            <button className="statusBtn flex-fill"
            onClick={() => dispatch({type: GLOBALTYPES.STATUS, payload: true})}>
                {authReducer.user.username}, what are you thinking?
            </button>
            
        </div>
    )
}

export default Status
