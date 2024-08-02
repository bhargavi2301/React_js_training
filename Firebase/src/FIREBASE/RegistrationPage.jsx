import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
    const [name,setName]=useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [error,setError]=useState();
    const [msg,setMsg]=useState();

    let navigate=useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log("---------------submit button clickd");
        const userDetails = await createUserWithEmailAndPassword(auth,email,password);

        const user = userDetails.user;

        if(user)
          {
            await setDoc(doc(db,"student",user.uid),{
              'name' : name,
              'email' : email,
            })
            console.log("successfully record inserted");
            setMsg ("successfully record inserted")
          }
    }
  return (
    <div>
            <form onSubmit={(e)=>handleSubmit(e)} >
            {msg && <p style={{color:"green"}}>{msg}</p>}
            {error && <p>{error}</p>}
             <input type="text"  placeholder='enter name' onChange={(e)=>setName(e.target.value)}/><br></br>
             <input type='text' placeholder='enter email'  onChange={(e)=>setEmail(e.target.value)}></input><br></br>
             <input type="text" placeholder='enter password' onChange={(e)=>setPassword(e.target.value)} /><br></br>
             <button>Click me</button>
             <br></br>

            </form> 
            <p onClick={()=>navigate("/login")}>already registerd? click here for login </p>
    </div>
  )
}
