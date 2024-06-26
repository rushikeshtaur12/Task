'use client'
import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [userData, setUserData] = useState<{ id: string, name: string, email: string, message: string }[]>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userDataCollection = collection(db, 'userdata');
    const userDataSnapshot = await getDocs(userDataCollection);
    const userDataList = userDataSnapshot.docs
      .filter(doc => !doc.data().isDeleted) // Filter out deleted documents
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      //@ts-ignore
    setUserData(userDataList);
  };
  const addDataToFirestore = async () => {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if any field is empty
    if (!name || !email) {
        alert("Name and email fields are mandatory. Please fill in all fields.");
        return;
    }
    // Check if email matches the pattern
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    try {
        const userDataCollection = collection(db, 'userdata');
        const userDataSnapshot = await getDocs(userDataCollection);
        const userDataList = userDataSnapshot.docs.filter(doc => !doc.data().isDeleted);  
        const docRef = await addDoc(collection(db, 'userdata'), {
            userid: userDataList.length + 1, // Calculate serial number
            name: name,
            email: email,
            message: message,
            isDeleted: false // Set isDeleted to false initially
        });

        console.log('Document written with ID: ', docRef.id);
        setName("");
        setEmail("");
        setMessage("");
        alert("Data added successfully");
        fetchUserData(); // Refresh the data after adding
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};
  

  const deleteUserData = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this data?");
    if (!confirmDelete) {
      return;
    }
  
    try {
      await updateDoc(doc(db, 'userdata', id), {
        isDeleted: true,
      });
      console.log('Document with ID ', id, ' marked as deleted');
      alert("Data marked as deleted successfully");
      fetchUserData(); // Refresh the data after deletion
    } catch (error) {
      alert('Error marking document as deleted: ' + error);
    }
  };
  

  const updateUserData = async (id: string) => {
    try {
      await updateDoc(doc(db, 'userdata', id), {
        name: name,
        email: email,
        message: message
      });
      console.log('Document with ID ', id, ' updated');
      setName("");
      setEmail("");
      setMessage("");
      setEditingId(null);
      alert("Data updated successfully");
      fetchUserData(); // Refresh the data after update
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };
//@ts-ignore
  const handleEdit = (data) => {
    setName(data.name);
    setEmail(data.email);
    setMessage(data.message);
    setEditingId(data.id);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-3xl w-full mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 dark:text-black">Enter Your Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-black">Name</label>
            <input
              type="text"
              className="border rounded-lg py-2 px-3 w-full  dark:text-black focus:outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-black">Email</label>
            <input
              type="email"
              className="border rounded-lg py-2 px-3 w-full focus:outline-none dark:text-black focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern='/^[^\s@]+@[^\s@]+\.[^\s@]+$/'
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-black">Text Message</label>
            <input
              type="text"
              className="border rounded-lg py-2 dark:text-black px-3 w-full focus:outline-none focus:border-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        {editingId ? (
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-4" onClick={() => updateUserData(editingId)}>Update</button>
        ) : (
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-4" onClick={addDataToFirestore}>Submit</button>
        )}
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        <h2 className="text-lg font-semibold mb-4">User Data</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-red">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Message</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((data) => (
              <tr key={data.id}>
                <td className="border border-gray-300 px-4 py-2">{data.name}</td>
                <td className="border border-gray-300 px-4 py-2">{data.email}</td>
                <td className="border border-gray-300 px-4 py-2">{data.message}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md mr-2" onClick={() => deleteUserData(data.id)}>Delete</button>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded-md" onClick={() => handleEdit(data)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
