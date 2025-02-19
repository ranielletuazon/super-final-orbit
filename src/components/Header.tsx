import logo from '../assets/orbitlogo.png'
import newlogo from '../assets/orbit.png'
import styles from './css/Header.module.css'
import React, { SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { auth, db, storage } from '../components/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import background from '../assets/background.png';

export default function Header({ user }: { user: any }){

    const [loading, setIsLoading] = useState(false);
    // States
    const [profileImageIcon, setProfileImageIcon] = useState<string | null>(null);

    const handleLogout = async () => {
            setIsLoading((prev) => !prev);
            toast.promise(
                new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
                    auth.signOut()
                ),{
                    loading: 'Logging out...',
                    success: 'Logged out!',
                    error: 'An error occured while logging out. Please try again.'
                }
            )
        }

    useEffect(()=>{
        const profileImage = async () => {
            if (user) {
                try {
                    const userDocRef = doc(db, "user", user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        if (userData.profileImage) {
                            const profileImageRef = ref(storage, userData.profileImage);
                            const profileUrl = await getDownloadURL(profileImageRef);
                            setProfileImageIcon(profileUrl);
                        } else {
                            setProfileImageIcon(null);
                        }
                    } else {
                        setProfileImageIcon(null);
                    }
                } catch (e){
                    console.log(e, "error");
                }
            }
        }

        profileImage();
    },[profileImageIcon])

    return(
        <>
            <div className={styles.header}>
                <img src={newlogo} alt="Orbit Logo" className={styles.logo}/>
                <div className={styles.menubar}>
                    <div className={styles.menus}>
                        <button className={styles.menuButton}><i className="fa-solid fa-house" ></i></button>
                        <button className={styles.menuButton}><i className="fa-solid fa-gamepad" ></i></button>
                        <button className={styles.menuButton}><i className="fa-solid fa-rocket" ></i></button>
                        <button onClick={handleLogout} disabled={loading} >Logout</button>
                    </div>
                    <div className={styles.menus}>
                        <button className={styles.menuButton}><i className="fa-solid fa-gear"></i></button>
                        {
                            profileImageIcon && 
                            <button className={styles.profileButton} >
                                {profileImageIcon && <img src={profileImageIcon} alt="Profile" className={styles.profileImage}/>}
                            </button>
                        }
                    </div>
                    
                </div>
            </div>
        </>
    );
}