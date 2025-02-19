import styles from "./css/Login.module.css";
import logo from '../assets/orbitlogo.png';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner'; 
import { auth, db } from '../components/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({user}: {user:any}){

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        setLoading((prev) => !prev);
        console.log('Button pressed');
    
        // Set initial message for loading state
        let loginMessage = 'Logging in...';
    
        toast.promise(
            signInWithEmailAndPassword(auth, email, password)
            .then( async (userCredential) => {
                const user = userCredential.user;
    
                // Fetch user data from Firestore to check emailConsent
                const userDocRef = doc(db, 'user', user.uid);
                const docSnap = await getDoc(userDocRef);
    
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (!userData?.emailConsent) {
                        // If emailConsent is not true, show warning and navigate to /setup
                        loginMessage = 'Logged in successfully!';
                        setTimeout(() => navigate('/setup'), 1000);
                        setTimeout(() => toast(`Welcome, ${userData?.username}`), 3000);
                    } else {
                        loginMessage = 'Logged in successfully!';
                        setTimeout(() => navigate('/space'), 1000);
                        setTimeout(() => toast(`Welcome, ${userData?.username}`), 3000);
                    }
                } else {
                    toast.error('User data not found!');
                    loginMessage = 'An unexpected error occurred.';
                }
    
                return loginMessage;
            }).catch((error) => {
                const errorCode = error.code;
    
                if (errorCode === "auth/too-many-requests") {
                    setLoading(false);
                    loginMessage = "Too many login attempts. Please try again later.";
                } else if (errorCode === "auth/invalid-credential") {
                    setLoading(false);
                    loginMessage = "Invalid credentials. Incorrect email or password.";
                } else {
                    setLoading(false);
                    loginMessage = "An unexpected error occurred.";
                }
    
                return Promise.reject(loginMessage);
            }),
            {
                loading: 'Logging in...',
                success: (loginMessage) => loginMessage, // Use the message from the success handler
                error: (loginMessage) => loginMessage, // Use the error message from the catch block
            }
        );
    };

    return(
        <>
            <div className={styles.container}>
                <div className={styles.page}>
                    <div className={styles.header}>
                        <img src={logo} alt="Orbit Logo" className={styles.logo}/>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.headerTitle}>WELCOME BACK!</div>
                            <div className={styles.message}>Best of luck to your games!</div>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.cardInput}>
                            <label className={styles.emailInput}>Email</label>
                            <input type="email" className={styles.emailBox} value={email} required placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}/>

                            <label className={styles.passwordInput}>Password</label>
                            <input type="password" className={styles.passwordBox} value={password} required placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>

                            <button className={styles.submit} type="submit" disabled={loading}>Login</button>
                        </form>
                        <Link to="/register" className={styles.register}>
                            Need an account? <span style={{ color: '#2cc6ff' }}>REGISTER</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}