import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { cloudName, uploadPreset, API_URL } from "../../config/keys"
import M from "materialize-css"

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (url){
            fetch("/createPost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: url
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error){
                    M.toast({html: data.error, classes: "#d50000 red accent-4"})
                }
                else{
                    M.toast({html: "Posted Successfully", classes: "#43a047 green darken-1"})
                    history.push('/')
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [url])

    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", uploadPreset)
        data.append("cloud_name", cloudName)
        fetch(API_URL, {
            method: "post",
            body: data
        })
        .then(res => res.json())
        .then(data => {
            setUrl(data.secure_url)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="card input-field createpost-input">
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <input type="text" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)}/>
            <div className="file-field input-field">
                <div className="btn red darken-3 waves-effect waves-light">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn red darken-3 waves-effect waves-light" type="submit" name="action" onClick={() => postDetails()}>Post
                <i className="material-icons right">send</i>
            </button>
        </div>
    )
}

export default CreatePost
