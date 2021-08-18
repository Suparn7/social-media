const  valid = ({fullname, username, email, password, cf_password, gender}) => {
    const err = {}

    if(!fullname){
        err.fullname = "Please Enter Your Full Name."
    }else if(fullname.length > 25){
        err.fullname = "Full Name Is Upto 25 Characters Only."
    }


    if(!username){
        err.username = "Please Enter Your User Name."
    }else if(username.replace(/ /g,"").length > 25){
        err.username = "User Name Is Upto 25 Characters Only."
    }

    if(!email){
        err.email = "Please Enter Your Email."
    }else if(!validateEmail(email)){
        err.email = "Email Format Is Incorrect."
    }

    if(!password){
        err.password = "Please Enter Your Password Carefully."
    }else if(password.length < 6){
        err.password = "Password Must Be Of At Least 6 Characters."
    }

    if(password !== cf_password){
        err.cf_password = "Please Check Your Password Again."
    }

    return{
        errMsg: err,
        errLength: Object.keys(err).length
    }
}

function validateEmail(email) {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default valid;