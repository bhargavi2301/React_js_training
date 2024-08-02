/* eslint-disable no-unused-vars */
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, Timestamp, arrayUnion } from 'firebase/firestore';
// import { auth, db } from '../FireBaseConfig';
import { auth, db } from '../FirebaseConfig';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function ViewPost() {
    const [post, setPost] = useState([]);
    const [postUsers, setPostUsers] = useState({});
    const [userProfile, setUserProfile] = useState()
    const [newComment, setNewComment] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        fetchAllPostFun();
    }, [])

    // fetching all users from database
    const fetchUsers = async () => {
        const userData = await getDocs(collection(db, "Students"))
        // console.log("userData------>>>>",userData);
        const users = {}
        const profile = {}
        // Key : value
        // userid : name
        userData.forEach((doc) => {
            const userRecord = doc.data();
            // console.log("====>>>",userRecord);               //userRecord = name, email, profilePicture
            users[doc.id] = userRecord.Name;
            profile[doc.id] = userRecord.ProfilePicture;
        })
        setUserProfile(profile);
        setPostUsers(users)
        console.log("posted by :------>>>", postUsers);
    }
    // Fetching all posts from collection 
    const fetchAllPostFun = async () => {
        const querySnapshot = await getDocs(collection(db, "post"))
        const fetchPost = [];

        querySnapshot.forEach((doc) => {
            const record = doc.data();
            // console.log("===>>>Record",record);    
            //record = title, description, image, userid, timestamp

            fetchPost.push({
                'id': doc.id,
                'title': record.title,
                'description': record.description,
                'image': record.image,
                'likes': record.likes || [],
                'comments': record.comments,
                'userid': record.user
                // 'createdAt' : 
            })
            // console.log("--->>>>>fetchPost",fetchPost);
            // console.log(postUsers);
            setPost(fetchPost)

        })
    }

    // handle likes on the post
    const handleLike = async (postId) => {
        const specific_post = await getDoc(doc(db, "post", postId))

        const postDataLikesList = await specific_post.data().likes || [];

        console.log("-------->>>postData", postDataLikesList);

        const user = auth.currentUser;
        if (postDataLikesList.includes(user.uid)) return;
        console.log("*Added 1 like");

        await updateDoc(doc(db, "post", postId), {
            'likes': [...postDataLikesList, user.uid]
        })

        const updatePost = await post.map((post) => post.id === postId ? { ...post, 'likes': [...post.likes, user.uid] } : post)

        setPost(updatePost)
    }

    // handle comments on the post
    const handleComment = async (postid) => {
        const user = auth.currentUser;
        console.log("postid--->>>", postid);

        const newCommentObj = {
            text: newComment,
            userid: user.uid,
            timestamp: Date.now()
        }

        await updateDoc(doc(db, "post", postid), {
            "comments": arrayUnion(newCommentObj)
        })
        setNewComment("")
        const updateCommentPost = await post.map((post) => post.id === postid ? { ...post, comments: [...post, comments, newCommentObj] } : post)
        setPost(updateCommentPost)
        console.log("............newpost:", post)
    }


    // delete post
    const handleDelete = async (docid) => {
        await deleteDoc(doc(db, 'post', docid))
        setPost(post.filter(item => item.id !== docid))
    }

    return (
        <div>
            <h1>View All Post</h1>
            {post.map((singlePost, index) => {
                return <div style={{ width: '50%', margin: 'auto' }} key={index}>
                    <img src={userProfile[singlePost.userid]} width="70px" />
                    <h3>{singlePost.title}</h3>
                    {/* <h4>{singlePost.userid}</h4> */}
                    <h5>Posted by :  {postUsers[singlePost.userid]}</h5>
                    <p>{singlePost.description}</p>
                    <img src={singlePost.image} width={250} />
                    <br /><br />
                    <h3>Likes : {singlePost.likes?.length || 0}</h3>
                    <button onClick={() => { handleLike(singlePost.id) }}>Like</button>
                    <button onClick={() => { handleDelete(singlePost.id) }}>Delete</button>
                    <br /> <br />
                    <h3>Comment Section</h3>
                    <input type="text" placeholder='Type your Comment' value={newComment} onChange={(e) => { setNewComment(e.target.value) }} />
                    <button onClick={() => handleComment(singlePost.id)}>Add Comment</button>
                    <br /><br />
                    <hr /><br /><hr /><br />
                </div>
            })}
        </div>
    )
}