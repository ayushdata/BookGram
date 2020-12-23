import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from "materialize-css"
import { UserContext } from '../../App'

const Signin = () => {
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const postData = (e) => {
        e.preventDefault();
        if (!email || !password){
            M.toast({html: "Please provide all inputs", classes: "#d50000 red accent-4"})
            return
        }
        else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid E-mail, please try again", classes: "#d50000 red accent-4"})
            return
        }
        else{
            fetch("/signin", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error){
                    M.toast({html: data.error, classes: "#d50000 red accent-4"})
                }
                else{
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({type: 'USER', payload: data.user})
                    M.toast({html: "Successfully Signed In.", classes: "#43a047 green darken-1"})
                    history.push('/')
                }
            })
            .catch(err => {
                console.log(err)
            })
        } 
    }

    return (
        <form action='#' onSubmit={postData}>
            <div className="mycard">    
                <div className="card auth-card input-field">
                    <h2 className="mysitetitle">BookGram</h2>
                    <input autoFocus={true} type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <br/><br/>
                    <button className="btn red darken-3 waves-effect waves-light" type="submit">Sign In
                        <i className="material-icons right">send</i>
                    </button>
                    <p>Don't have an account yet? <Link className="linktransfername" to='/signup'>Sign Up</Link> for an account.</p>
                </div>
            </div> 
        </form> 
    )
}

export default Signin