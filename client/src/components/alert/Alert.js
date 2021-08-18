
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Loading from './Loading'
import Toast from './Toast'

const Alert = () => {
    const {alertReducer} = useSelector((state) => state)
    const dispatch = useDispatch();
    //console.log(state); //authReducer, notifyReducer
    return (
        <div>
            {alertReducer.loading && <Loading />}
           
            {
                alertReducer.error && 
                <Toast msg={{title: 'Error', body: alertReducer.error}} 
                handleShow={() => dispatch({type: GLOBALTYPES.ALERT,payload:{}})}
                bgColor="bg-danger" />
            }

            {
                alertReducer.success && 
                <Toast msg={{title: 'Success', body: alertReducer.success}} 
                handleShow={() => dispatch({type: GLOBALTYPES.ALERT,payload:{}})} 
                bgColor="bg-success" />
            }
        </div>
    )
}

export default Alert
