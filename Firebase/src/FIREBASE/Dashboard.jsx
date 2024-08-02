import React, { useEffect, useState } from 'react'
import { auth, db, storage } from '../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { update } from 'firebase/database';

export default function Dashboard() {
    const [userDetails, setUserDetails] = useState(null);
    const [profileUrl,setProfileUrl]=useState();
    const [uplodingStatus,setUplodingStatus]=useState();
    const navigate = useNavigate();

    useEffect(() => {
        const subscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchCurrentUserDetails(user);
            }
        })
    }, []);

    const fetchCurrentUserDetails = async () => {
        const user = auth.currentUser;
        if (user) {
            const userData = await getDoc(doc(db, "student", user.uid));
            console.log(`welcome dashboard ${userData.data().name}`);
            setUserDetails(userData.data());
        }
    }
    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login", { replace: "true" })
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(".....profilrUrl",profileUrl);
        setUplodingStatus(true);

        const user = auth.currentUser;

            if(user)
            {
                const storageRef = await ref(storage,`profilepictures/${user.uid}`);
                await uploadBytes(storageRef,profileUrl);
                const downloadUrl = await getDownloadURL(storageRef);

                console.log(".........download",downloadUrl);

                await updateDoc(doc(db,"Student",user.uid),{
                    "profilepic" : downloadUrl
                })
            }
            setUplodingStatus(false);
     }
    return (
        <div>
            {userDetails ? <h1>welcome {userDetails.name}</h1> : <h1>Loading....</h1>}
            <form onSubmit={handleSubmit}>
                <label>upload your image</label>
                <input type='file' onChange={(e)=>setProfileUrl(e.target.files[0])}></input>
                <input type="submit" value="upload" />
            </form>
            <button onClick={handleLogout}>logout</button>
            <h1 onClick={()=>{navigate("/newpost")}}>add new post</h1>
            <h1 onClick={()=>{navigate("/viewpost")}}>view post</h1>
            <h1 onClick={()=>{navigate("/ALLUSER")}}>all user</h1>
        </div>
    )
}
