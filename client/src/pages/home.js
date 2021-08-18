import React from 'react'
import Status from '../components/home/Status'
import Posts from '../components/home/Posts'
import { useSelector } from 'react-redux'
import LoadIcon from '../images/loading.gif'
import RightSideBar from '../components/home/RightSideBar'

const Home = () => {
    const {postReducer} = useSelector((state) => state)
    return (
        <div className="home row mx-0">
            <div className="col-md-8">
                <Status />
                {
                    postReducer.loading
                    ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                    : (postReducer.result === 0 && postReducer.posts.length === 0) 
                        ? <h2 className="text-center">No Posts Yet</h2>
                        : <Posts />
                }
                
            </div>

            <div className="col-md-4">
                <RightSideBar />
            </div>
        </div>
    )
}

export default Home
