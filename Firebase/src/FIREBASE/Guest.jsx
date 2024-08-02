import React from 'react'
import { collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Guest() {
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchAllusers();
    }, []);

    const fetchAllusers = async () => {
        const querySnapshot = await getDocs(collection(db, "Student"))
        // console.log("----> QuerySnapshot",querySnapshot);

        const users = [];

        querySnapshot.forEach((doc) => {
            users.push({ uid: doc.id, ...doc.data() })
        })

        setAllUsers(users);
        console.log("----> users", users);
    }
    const deleteUser = async (userid) => {
        console.log("--->delete User", userid);
        const selectedUser = getDoc(doc(db, "Student", userid))
        await deleteDoc(doc(db, "Student", userid)); // it will remove from firestore 

        selectedUser.deleteUser;
        // remove from array 
        const newArray = allUsers.filter(user => user.uid !== userid)
        setAllUsers(newArray);
        console.log(newArray);
    }

    return (
        <div>
            <div>
                <h1>ALL USERS</h1>

                <table border={2}>
                    <thead>
                        <tr>
                            <th>SR. NO</th>
                            <th>IMAGE</th>
                            <th>Name</th>
                            <th>EMAIL</th>
                            <th colSpan={2}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers
                            ?
                            allUsers.map((user, index) => {
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.profilepic ? <img src={user.profilepic} height={50} width={50} /> : <img src="https://img.freepik.com/premium-photo/3d-icon-cartoon-person-profile-avatar-user-profile-3d-render-illustration_276199-401.jpg" height={50} width={50} />}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td><button onClick={() => navigate(`/edit/${user.uid}`)}>EDIT</button></td>
                                    <td><button onClick={() => deleteUser(user.uid)}>DELETE</button></td>
                                </tr>
                            })
                            : <h1>No Users Found</h1>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
