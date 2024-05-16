'use client'
import { db } from './firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'
import React, { useState } from 'react'
async function addDatatoFirestore(name: any, email: any, message: any) {
  try {
    const docRef = await addDoc(collection(db, 'userdata'), {
      name: name,
      email: email,
      message: message,
    });
    console.log('docRef is is', docRef.id)
    return true
  }
  catch (error) {
    console.log('Error while ading data', error)
  }

}
export default function home() {
  const [name, setName] = useState(" ")
  const [email, SetEmail] = useState(" ")
  const [messages, setMessages] = useState(" ")

//@ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    const added = await addDatatoFirestore(name, email, messages);
    if (added) {
      setName("");
      SetEmail(" ");
      setMessages(" ");
      alert("data is added succesfuly")
    }

  }

  return (
    <form onSubmit={handleSubmit}>
      <div>

        {/* for name  */}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

{/* for email */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => SetEmail(e.target.value)}
        />


        {/* for message  */}

        <label htmlFor="messages">TextMessage</label>
        <input
          type="text"
          id="messages"
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
        />
        
      </div>

      <div>
        <button type="submit">submit</button>
      </div>


    </form>
  )
}