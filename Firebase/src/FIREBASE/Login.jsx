import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db,"student",user.uid));

        if(userDoc.exists)
          {
            console.log(userDoc.data());
            console.log(userDoc.data().name);
            // console.log();
            alert(`welcome ${userDoc.data().name}`);
            navigate("/dashboard" , {replace : true})
          }
          console.log(user.uid);
        // try {
        //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
        //     const user = userCredential.user;
        //     console.log(user.uid);
        // } catch (error) {
        //     console.error(error.message);
        // }
    };

    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type='text' placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
                <br />
                <input type="password" placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="submit">Login</button>
            </form>
            <h4 onClick={() => navigate("/" , {replace : true})}>Go to register page</h4>
        </div>
    );
}
