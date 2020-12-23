import React, { useState, useEffect, useContext } from 'react';
import { cloudName, uploadPreset, API_URL } from "../../config/keys"
import {UserContext} from "../../App"

const Profile = () => {
    const [mypics, setMypics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [profilePic, setProfilePic] = useState("")
    
    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            setMypics(result.myposts)
        })
    }, [])

    useEffect(() => {
        if(profilePic){
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
                fetch('/updateprofilepic', {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        profilePic: data.secure_url
                    })
                }).then(res => res.json())
                .then(result => {
                    localStorage.setItem("user", JSON.stringify({...state, profilePic: result.profilePic}))
                    dispatch({type: "UPDATEPIC", payload: result.profilePic})
                }) 
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [profilePic])

    const updateProfilePic = (file) => {
        setProfilePic(file)
    }

    return (
        <div style={{maxWidth:"800px", margin:"0px auto"}}>
            <div style={{margin:"18px 0px", borderBottom:"1px solid grey"}}>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <div>
                        <img alt="DP" style={{width: "160px", height: "160px", borderRadius: "80px"}}  src={state?state.profilePic:""}/>
                    </div>
                    <div>
                        <h4>{state?state.name:"loading..."}</h4>
                        <div style={{display: "flex", justifyContent: "space-between", width:"108%"}}>
                            <h6>{mypics.length} Posts</h6>
                            <h6>{state?state.followers.length:"0"} Followers</h6>
                            <h6>{state?state.following.length:"0"} Following</h6>
                        </div>
                    </div>
                </div>
                <input type="file" id="selectedFile" style={{display: "none"}} 
                onChange={
                    (e) => {
                        if(window.confirm("Are you sure you want to change your profile pic?")){
                            updateProfilePic(e.target.files[0])
                        }
                    }
                }/>
                <button style={{marginBottom: "10px", marginLeft: "16%"}} className="btn-small blue darken-3 waves-effect waves-light" onClick={() => document.getElementById('selectedFile').click()}>Change Pic</button>
            </div>
            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img className="item" key={item._id} alt={item.title} src={item.photo}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile