import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { auth, db } from './components/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from "firebase/auth"; // Import Firebase User type
import { ProtectedRoute } from './components/ProtectedRoute';
import { getDatabase, ref, set, onDisconnect, serverTimestamp, update } from 'firebase/database';

import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Space from './pages/Space';
import AccountSetup from './pages/AccountSetup';
import Settings from './pages/Settings';
import Community from './pages/Community';

import './App.css';

function App() {

  const [user, setUser] = useState<User | null>(null);

  interface UserData {
    username: string;
    id: string;
    email?: string;
    profileImage: string;
  }

  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  // Detect if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userLoggedIn) => {
      setUser(userLoggedIn);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "user", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setCurrentUser({ id: uid, ...userDoc.data() } as UserData);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data. Please try again.");
    }
  };

  // Fetch user data once user is available
  useEffect(() => {
    // Fix this soon
    if (user?.uid) {
      fetchUserData(user.uid);
    }
  }, [user]);

  // This is for setting the user's status in Realtime Database
  useEffect(() => {
    if (!user || !currentUser) {
      return;
    } else {
      // Set the user's status in Realtime Database
      try {
        const username = currentUser?.username ?? "Unknown"; // Fallback to "Unknown" if undefined
        const email = user.email ?? "N/A"; // Fallback to "N/A" if undefined
        const id = user.uid;
          
        const db = getDatabase();
        const rdbUserRef = ref(db, `users/${id}`);
        const onDisconnectRef = onDisconnect(rdbUserRef);

        update(rdbUserRef, {
          status: "online",
          username: username,
          email: email,
          id: id,
          profileImage: currentUser?.profileImage,
        });

        onDisconnectRef.update({
          status: "offline",
        });
      } catch (e) {
        console.error("Failed to write data to Realtime Database.");
        console.log(e);
      }
    }
  }, [user, currentUser]);
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home user={user} />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register />} />
          <Route path='/space' element={<ProtectedRoute><Space user={user} /></ProtectedRoute>} />
          <Route path='/setup' element={<ProtectedRoute><AccountSetup user={user} currentUser={currentUser} /></ProtectedRoute>} />
          <Route path='/settings' element={<ProtectedRoute><Settings user={user} currentUser={currentUser} /></ProtectedRoute>} />
          <Route path='/community' element={<ProtectedRoute><Community user={user} /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            backgroundColor: '#1c2120',
            border: '1px solid #2cc6ff',
            color: 'white',
            opacity: 0.9
          },
        }}
      />
    </>
  );
}

export default App;
