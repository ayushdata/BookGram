import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
    const {state, dispatch} = useContext(UserContext)
    const [data, setData] = useState([])
    useEffect(() => {
        fetch('/allposts', {
            headers:{
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            setData(result.posts)
        })
    }, [])

    const likePost = (postId) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId
            })
        }).then(res => res.json())
        .then(result => {
            const newdata = data.map(item => {
                if (item._id === result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newdata)
        }).catch((err) => {
            console.log(err)
        })
    }

    const unlikePost = (postId) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId
            })
        }).then(res => res.json())
        .then(result => {
            const newdata = data.map(item => {
                if (item._id === result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newdata)
        }).catch((err) => {
            console.log(err)
        })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
        .then(result => {
            const newdata = data.map(item => {
                if (item._id === result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newdata)
        }).catch((err) => {
            console.log(err)
        })
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            const newdata = data.filter(item => {
                return item._id !== result._id
            })
            setData(newdata)
        })
        // TODO: Delete image stored in cloudinary too
    }

    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            const newdata = data.map(item => {
                if (item._id == result._id){
                    return result
                } else{
                    return item
                }
            })
            setData(newdata)
        })
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{paddingLeft: 7, paddingTop: 5}}>
                                
                                {/* Users can navigate to other user profiles by clicking on their names but if they click on their own name then they'll be navigated to their own profile page*/}
                                <Link to={
                                    item.postedBy._id !== state._id
                                    ?
                                    `/profile/${item.postedBy._id}`
                                    :
                                    "/profile"}>
                                    {item.postedBy.name} 
                                </Link>
                                
                                {/* Logged in users can only delete the posts made by them */}
                                {
                                    item.postedBy._id === state._id
                                    &&
                                    <i style={{float: "right", paddingTop: 4}} className="material-icons cursor-change"
                                        onClick={() => {
                                            if(window.confirm("Are you sure you want to delete this post?")){
                                                deletePost(item._id)
                                            }
                                        }}
                                    >delete</i>
                                }
                            </h5>
                            <div className="card-image">
                                <img alt="posted pic" src={item.photo}/>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color: "red"}}>favorite</i>
                                {
                                    item.likes.includes(state._id)
                                    ?
                                    <i className="material-icons cursor-change" onClick={() => unlikePost(item._id)}>thumb_down</i>
                                    :
                                    <i className="material-icons cursor-change" onClick={() => likePost(item._id)}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                        <h6 key={record._id}><span style={{fontWeight: 500}}>{record.postedBy.name}</span> {record.text}
                                            {
                                                record.postedBy._id === state._id
                                                &&
                                                <i style={{float: "right", fontSize: 20}} className="material-icons cursor-change"
                                                    onClick={() => {
                                                        if(window.confirm("Are you sure you want to delete this comment?")){
                                                            deleteComment(item._id, record._id)
                                                        }
                                                    }}>delete</i>
                                            }
                                        </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                        e.preventDefault()
                                        makeComment(e.target[0].value, item._id)
                                        e.target[0].value = null
                                    }}>
                                    <input type="text" placeholder="Add comment..."/>
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home