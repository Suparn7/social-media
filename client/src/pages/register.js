import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { register } from '../redux/actions/authAction'

const Register = () => {
    const {authReducer, alertReducer} = useSelector((state) => state)
    const dispatch = useDispatch();
    const history = useHistory()

    const initialState = {
        fullname: '',
        username: '',
        email: '', 
        password: '',
        cf_password: '',
        gender: 'male',
    }
    const [userData, setUserData] = useState(initialState)
    const {fullname, username, email, password, cf_password} = userData

    const [typePass, setTypePass] = useState(false);
    const [typeCfPass, setTypeCfPass] = useState(false);

    useEffect(() => {
        if(authReducer.token){
            history.push("/")
        }
    },[authReducer.token, history])


    const handleChangeInput = (e) => {
        const{name, value} = e.target
        //console.log(e.target)
        setUserData({...userData, [name]: value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(userData);
        dispatch(register(userData))
       
    }
    return (
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">Social Media</h3>
                
                <div className="form-group">
                    <label htmlFor="fullname">Full Name</label>
                    <input type="text" className="form-control" id="fullname" onChange={handleChangeInput} value={fullname} name="fullname" style={{background: `${alertReducer.fullname ? `#fd2d6a14` : ''}`}}/>
                    <small className="form-text text-danger">{alertReducer.fullname? alertReducer.fullname : ''}</small>
                </div>

                <div className="form-group">
                    <label htmlFor="username">User Name</label>
                    <input type="text" className="form-control" id="username" onChange={handleChangeInput} value={username.toLowerCase().replace(/ /g, '')} name="username" style={{background: `${alertReducer.username ? `#fd2d6a14` : ''}`} }/>
                    <small className="form-text text-danger">{alertReducer.username? alertReducer.username : ''}</small>
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" onChange={handleChangeInput} value={email} name="email" style={{background: `${alertReducer.email ? `#fd2d6a14` : ''}`} } />
                    <small className="form-text text-danger">{alertReducer.email? alertReducer.email : ''}</small>
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <div className="pass">
                        <input type={typePass? "text" : "password"} className="form-control" id="exampleInputPassword1" onChange={handleChangeInput} value={password} name ="password" style={{background: `${alertReducer.password ? `#fd2d6a14` : ''}`} }/>
                        <small onClick={() => setTypePass(!typePass)}> {typePass? 'Hide' : 'Show'} </small>
                    </div>
                    <small className="form-text text-danger">{alertReducer.password? alertReducer.password : ''}</small>
                    
                </div>

                <div className="form-group">
                    <label htmlFor="cf_password">Confirm Password</label>
                    <div className="pass">
                        <input type={typeCfPass? "text" : "password"} className="form-control" id="cf_password" onChange={handleChangeInput} value={cf_password} name ="cf_password" style={{background: `${alertReducer.cf_password ? `#fd2d6a14` : ''}`} } />
                        <small onClick={() => setTypeCfPass(!typeCfPass)}> {typeCfPass? 'Hide' : 'Show'}</small>
                    </div>
                    <small className="form-text text-danger">{alertReducer.cf_password? alertReducer.cf_password : ''}</small>
                    
                </div>

                <div className="row justify-content-between mx-0 mb-1">
                    <label htmlFor="male">
                        Male: <input type="radio" id="male" name="gender" value="male" defaultChecked onChange={handleChangeInput}  />
                    </label>

                    <label htmlFor="female">
                        Female: <input type="radio" id="female" name="gender" value="female" onChange={handleChangeInput}  />
                    </label>

                    <label htmlFor="other">
                        Other: <input type="radio" id="other" name="gender" value="other" onChange={handleChangeInput}  />
                    </label>
                </div>

                <button type="submit" className="btn btn-dark w-100">
                    Register
                </button>

                <p className="my-2">Already have an account?
                <Link to="/" style={{color:"crimson"}}>Login Now</Link>
                </p>
            </form>
        </div>
    )
}

export default Register
