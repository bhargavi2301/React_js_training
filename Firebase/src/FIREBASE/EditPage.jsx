import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from '../FirebaseConfig';
import { getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function EditPage() {
    const { uid } = useParams();
    const navigate = useNavigate();

    // State variables
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilepic, setProfilepic] = useState(null);
    const [loading, setLoading] = useState(false); // Optional loading state

    useEffect(() => {
        fetchUser();
    }, [uid]);

    const fetchUser = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'student', uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setName(userData.name || '');
                setEmail(userData.email || '');
                setProfilepic(userData.profilepic || null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateDoc(doc(db, 'student', uid), {
                name: name,
                email: email,
                // Add other fields you want to update
            });

            // Handle profile picture upload if selected
            if (profilepic) {
                const storageRef = ref(storage, `profilepictures/${uid}`);
                await uploadBytes(storageRef, profilepic);
                const downloadUrl = await getDownloadURL(storageRef);
                
                await updateDoc(doc(db, 'student', uid), {
                    profilepic: downloadUrl,
                });
            }

            // Navigate to the desired page after update
            navigate('/guest', { replace: true });
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilepic(file);
        }
    };

    return (
        <div>
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    required
                /><br />

                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                /><br />

                <label>Profile Picture:</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                /><br />

                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </form>
        </div>
    );
}
