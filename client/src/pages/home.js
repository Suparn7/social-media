import React, {useEffect} from 'react'
import Status from '../components/home/Status'
import Posts from '../components/home/Posts'
import { useSelector } from 'react-redux'
import LoadIcon from '../images/loading.gif'
import RightSideBar from '../components/home/RightSideBar'

let scroll = 0;

const Home = () => {
    const {postReducer} = useSelector((state) => state)

    window.addEventListener('scroll', () => {
        if(window.location.pathname === '/'){
            scroll = window.pageYOffset
            return scroll
        }
    })

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({top: scroll, behavior: 'smooth'})
        }, 100)
    },[])


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
