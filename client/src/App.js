import { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PageRender from './customRouter/PageRender';
import PrivateRouter from './customRouter/PrivateRouter';

// 
import Login from './pages/login';
import Home from './pages/home'
import Register from './pages/register';
import Alert from './components/alert/Alert';
import Header from './components/header/Header';
import StatusModal from './components/StatusModal';



import {useSelector, useDispatch} from 'react-redux'
import {refreshToken} from './redux/actions/authAction'
import {getPosts} from './redux/actions/postAction'
import {getSuggestions} from './redux/actions/suggestionsAction'

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes';
import SocketClient from './SocketClient';
import {getNotifies} from './redux/actions/notifyAction'
import CallModal from './components/message/CallModal';
import Peer from 'peerjs'


function App() {
  const {authReducer, statusReducer, modalReducer, callReducer} = useSelector((state) => state)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken())
    const socket = io()
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    

    //return to unmount so that memory leak stops
    return () => socket.close()

  },[dispatch])

  useEffect(() => {
    if(authReducer.token){
      dispatch(getPosts(authReducer.token))
      dispatch(getSuggestions(authReducer.token))
      dispatch(getNotifies(authReducer.token))
    } 
  },[dispatch,authReducer.token])

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    else if (Notification.permission === "granted") {}

    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }
  },[])

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    //console.log(newPeer);
    dispatch({type: GLOBALTYPES.PEER, payload: newPeer})
  },[dispatch])


  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className={`App ${(statusReducer || modalReducer) && 'mode'}`}>
        <div className="main">
          
          {authReducer.token && <Header />}
          {statusReducer && < StatusModal />}
          {authReducer.token && <SocketClient />}
          {callReducer && <CallModal />}

          <Route exact path ="/" component={authReducer.token? Home: Login} />
          <Route exact path ="/register" component={Register} />
          
          <PrivateRouter exact path="/:page" component={PageRender} />
          <PrivateRouter exact path="/:page/:id" component={PageRender} />
    
          </div>
      </div>
    </Router>
    
  );
}

export default App;
