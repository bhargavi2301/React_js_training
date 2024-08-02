import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth,db } from "../FirebaseConfig";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";

export default function ChatScreen() {
  const [currentUser, setCurrentUser] = useState();
  const [cid, setcid] = useState();
  const [chatUser, setChatuser] = useState();
  const [chatuserId, setChatuserid] = useState();
  const [newMessage, setChatMessage] = useState();

  const { uid } = useParams();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserDetails(user);
      }
    });
  }, []);

  const fetchUserDetails = async (user) => {
    const currentuserData = await getDoc(doc(db, "Student", user.uid));
    setCurrentUser(currentuserData.data().name);
    setcid(user.uid);

    const chatperson = await getDoc(doc(db, "Student", uid));
    setChatuser(chatperson.data().name);
    setChatuserid(uid);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const newMessageObj = {
      senderId: cid,
      reciverId: chatuserId,
      content: newMessage,
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, "Chats"), newMessageObj);
    setChatMessage("");
  };
  return (
    <div>
      <h1>Inbox</h1>
      <h2>welcome {currentUser}</h2>
      <h2>start chatting with {chatUser}</h2>
      <input type="text" placeholder="Type Here" onChange={(e) => setChatMessage(e.target.value)} value={newMessage} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}