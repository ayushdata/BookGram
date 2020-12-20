import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../../App"
import { useParams } from 'react-router-dom'

const UserProfile = () => {
    const [profile, setProfile] = useState(null)
    const [showFollow, setShowFollow] = useState(true)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    let showFollowButtonOnInitialRender = true;
    console.log(userid)
    
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            setProfile(result)
        })
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
        .then(result => {
            dispatch({type: "UPDATE", payload: {followers: result.followers, following: result.following}})
            localStorage.setItem("user", JSON.stringify(result))
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, result._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
        .then(result => {
            dispatch({type: "UPDATE", payload: {followers: result.followers, following: result.following}})
            localStorage.setItem("user", JSON.stringify(result))
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: prevState.user.followers.filter(item => item !== result._id)
                    }
                }
            })
            setShowFollow(true)
        })
    }

    return (
        <>
            {
                profile
                ?
                <div style={{maxWidth:"800px", margin:"0px auto"}}>
                    <div style={{display: "flex", justifyContent: "space-around", margin:"18px 0px", borderBottom:"1px solid grey"}}>
                        <div>
                            <img alt="DP" style={{width: "160px", height: "160px", borderRadius: "80px"}}  src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"/>
                        </div>
                        <div>
                            <h4>{profile.user.name}</h4>
                            <h6>{profile.user.email}</h6>
                            <div style={{display: "flex", justifyContent: "space-between", width:"108%"}}>
                                {
                                    profile.posts.length == 1
                                    ?
                                    <h6>1 Post</h6>
                                    :
                                    <h6>{profile.posts.length} Posts</h6>
                                }
                                {
                                    profile.user.followers.length == 1
                                    ?
                                    <h6>{profile.user.followers.length} Follower</h6>
                                    :
                                    <h6>{profile.user.followers.length} Followers</h6>
                                }
                                <h6>{profile.user.following.length} Following</h6>
                            </div>
                            {
                                state.following.includes(userid)
                                ?
                                showFollowButtonOnInitialRender = false
                                :
                                showFollowButtonOnInitialRender = true
                            }
                            {
                                showFollow && showFollowButtonOnInitialRender
                                ?
                                <button style={{marginBottom: "10px", marginTop: "10px"}} className="btn red darken-3 waves-effect waves-light" onClick={() => followUser()}>Follow</button>
                                :
                                <button style={{marginBottom: "10px", marginTop: "10px"}} className="btn red darken-3 waves-effect waves-light" onClick={() => unfollowUser()}>Unfollow</button>
                            }
                            </div>
                    </div>
                    <div className="gallery">
                        {
                            profile.posts.map(item => {
                                return (
                                    <img className="item" key={item._id} alt={item.title} src={item.photo}/>
                                )
                            })
                        }
                    </div>
                </div>
                :
                <h2 style={{textAlign: "center"}}>"Loading...!"</h2>
            }
        </>
    )
}

export default UserProfile