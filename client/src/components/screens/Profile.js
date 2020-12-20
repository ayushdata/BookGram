import React, { useState, useEffect, useContext } from 'react';
import {UserContext} from "../../App"

const Profile = () => {
    const [mypics, setMypics] = useState([])
    const { state, dispatch } = useContext(UserContext)

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
    
    return (
        <div style={{maxWidth:"800px", margin:"0px auto"}}>
            <div style={{display: "flex", justifyContent: "space-around", margin:"18px 0px", borderBottom:"1px solid grey"}}>
                <div>
                    <img alt="DP" style={{width: "160px", height: "160px", borderRadius: "80px"}}  src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"/>
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