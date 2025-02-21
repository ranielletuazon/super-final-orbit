import React, { useState, useEffect } from 'react';
import styles from './css/Settings.module.css';
import { toast } from 'sonner';
import { getDatabase, ref, set, onDisconnect, serverTimestamp } from 'firebase/database';
import logo from '../assets/orbitlogo.png'
import { auth } from '../components/firebase/firebase';
import { update } from 'firebase/database';

interface User {
    uid: string;
}
  
interface CurrentUser {
    username: string;
    email: string;
    profileImage: string;
}

export default function Settings ({user, currentUser}: {user: any, currentUser: any}) {

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user || !currentUser) {
          console.log("User or CurrentUser is undefined.");
          return;
        }

    }, [user, currentUser]);

    const handleLogout = async () => {
        setIsLoading((prev) => !prev);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    if (user) {
                        const realtimeDb = getDatabase();
                        const rdbUserRef = ref(realtimeDb, `users/${user.uid}`);
        
                        await update(rdbUserRef, {
                            status: "offline",
                        });
        
                        setTimeout(() => {
                            auth.signOut();
                            resolve("Logged out!");
                        }, 1000); 
                    } else {
                        setTimeout(() => {
                            reject("No user is logged in.");
                        }, 1000);
                    }
                } catch (error) {
                    console.error("Error during logout:", error);
                    setTimeout(() => {
                        reject("An error occurred while logging out. Please try again.");
                    }, 1000);
                } finally {
                    setIsLoading(false);
                }
            }),
            {
                loading: "Logging out...", 
                success: "Logged out!", 
                error: "An error occurred while logging out. Please try again.", 
            }
        );        
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.settingsSection}>
                    <div className={styles.logoDisplay}>
                        <img src={logo} alt="Logo" />
                    </div>
                    <nav>
                        <button className={styles.settingButton}>Account Settings</button>
                        <button className={styles.settingButton}>Profile Settings</button>
                        <button className={styles.settingButton}>Notifications</button>
                        <button className={styles.settingButton}>Privacy</button>
                        <button className={styles.settingButton}>Security</button>
                        <button className={styles.settingButton}>Help</button>
                        <button className={styles.settingButton} style={{color: "hsl(0, 100%, 25%)"}} onClick={handleLogout}>Log Out</button>
                    </nav>
                </div>
                <div className={styles.handlingSection}>
                    <div className={styles.handlingDiv}></div>
                </div>
            </div>
        </>
    );
}