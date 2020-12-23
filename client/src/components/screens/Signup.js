import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { cloudName, uploadPreset, API_URL } from "../../config/keys"
 
const Signup = () => {
    const history = useHistory()
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [profilePic, setProfilePic] = useState("")
    const [profilePicURL, setProfilePicURL] = useState(undefined)

    useEffect(() => {
        if (profilePicURL){
            uploadFields()
        }
    }, [profilePicURL])

    const uploadPic = () => {
        const data = new FormData()
        data.append("file", profilePic)
        data.append("upload_preset", uploadPreset)
        data.append("cloud_name", cloudName)
        fetch(API_URL, {
            method: "post",
            body: data
        })
        .then(res => res.json())
        .then(data => {
            setProfilePicURL(data.secure_url)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const uploadFields = () => {
        if (!email || !name || !password || !confirmpassword){
            M.toast({html: "Please provide all inputs", classes: "#d50000 red accent-4"})
            return
        }
        else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid E-mail, please try again", classes: "#d50000 red accent-4"})
            return
        }
        else if (password !== confirmpassword){
            M.toast({html: "Passwords do not match, Please try again", classes: "#d50000 red accent-4"})
            return
        }
        else{
            fetch("/signup", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, name, password, confirmpassword,
                    profilePic: profilePicURL
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error){
                    M.toast({html: data.error, classes: "#d50000 red accent-4"})
                }
                else{
                    M.toast({html: data.message + ". Please proceed to Sign In.", classes: "#43a047 green darken-1"})
                    history.push('/signin')
                }
            })
            .catch(err => {
                console.log(err)
            })
        } 
    }

    const postData = (e) => {
        e.preventDefault()
        if (profilePic){
            uploadPic()
        }
        else{
            uploadFields()
        }
    }

    return (
        <form action="#" onSubmit={postData}>
            <div className="mycard">
                <div className="card auth-card input-field">
                    <h2 className="mysitetitle">BookGram</h2>
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus={true}/>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input type="password" placeholder="Confirm Password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <div className="file-field input-field">
                        <div className="btn red darken-3 waves-effect waves-light">
                            <span>Upload Profile Pic</span>
                            <input type="file" onChange={(e) => setProfilePic(e.target.files[0])}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    <button className="btn red darken-3 waves-effect waves-light" type="submit">Sign Up
                        <i className="material-icons right">send</i>
                    </button>
                    <p>Already have an account? <Link className="linktransfername" to='/signin'>Sign In</Link> instead.</p>
                </div>
            </div>
        </form>
    )
}

export default Signup