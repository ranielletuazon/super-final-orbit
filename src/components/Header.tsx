import logo from '../assets/orbitlogo.png'
import newlogo from '../assets/orbit.png'
import styles from './css/Header.module.css'
import React, { SetStateAction, useEffect, useState } from 'react';
import { auth, db, storage } from '../components/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import background from '../assets/background.png';

export default function Header({ logout, user }: { logout: () => void, user: any }){

    // States
    const [profileImageIcon, setProfileImageIcon] = useState<string | null>(null);

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
                        <button onClick={logout}>Logout</button>
                    </div>
                    <div className={styles.menus}>
                        <button className={styles.menuButton}><i className="fa-solid fa-gear"></i></button>
                        <button className={styles.profileButton} >
                            {profileImageIcon && <img src={profileImageIcon} alt="Profile" className={styles.profileImage}/>}
                        </button>
                    </div>
                    
                </div>
            </div>
        </>
    );
}