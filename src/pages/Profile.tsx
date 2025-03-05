import styles from "./css/Profile.module.css";
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';

interface AccountSetupProps {
    user: any;
    currentUser: any;
}

export default function Profile({user, currentUser}: AccountSetupProps) {
    const [activeView, setActiveView] = useState<string>("profile");

    const getSlidePosition = () => {
        switch(activeView) {
            case "profile": return "translateX(-100%)";
            case "games": return "translateX(0%)";
            case "achievements": return "translateX(100%)";
        }
    };

    return(
        <>
            <div className={styles.container}>
                <div className={styles.page}>
                    <div className={styles.pageContainer}>
                        <Header user={user} />
                        <div className={styles.profileCard}>
                            <div className={styles.profileBackgroundImage}>
                                <img src={currentUser.profileImage} alt="Profile Image" className={styles.profileImage}/>
                            </div>
                            <div className={styles.profileViewCard}>
                                <div 
                                    className={styles.slidingBackground} 
                                    style={{ transform: getSlidePosition() }}
                                />
                                <button 
                                    className={activeView === "profile" ? styles.activeView : styles.buttonView} 
                                    onClick={() => setActiveView("profile")}
                                >
                                    Profile
                                </button>
                                <button 
                                    className={activeView === "games" ? styles.activeView : styles.buttonView} 
                                    onClick={() => setActiveView("games")}
                                >
                                    Games
                                </button>
                                <button 
                                    className={activeView === "achievements" ? styles.activeView : styles.buttonView} 
                                    onClick={() => setActiveView("achievements")}
                                >
                                    Achievements
                                </button>
                            </div>
                            <div className={styles.profileInformation}>
                                {activeView === "profile" ? (
                                    <>
                                        <div className={styles.usernameDisplay}>
                                            <div className={styles.names}>
                                                <span style={{color: "hsl(0, 0%, 75%)", fontSize: "2rem"}}>{currentUser.username}</span>
                                                <span style={{color: "hsl(0, 0%, 50%)", fontSize: "1rem"}}>@{currentUser.username}</span>
                                            </div>
                                            <div className={styles.rightSide}>
                                                <button className={styles.heart}><i className="fa-regular fa-heart"></i></button>
                                                <button className={styles.buttons}><i className="fa-solid fa-user-plus"></i></button>
                                            </div>
                                        </div>
                                        <div className={styles.bioDisplay}>{currentUser.bio ? `"${currentUser.bio}"` : `"Just a chill gamer"`}</div>
                                        <div className={styles.otherDetails}>
                                            {`${currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1)} | ${new Date().getFullYear() - new Date(currentUser.birthdate).getFullYear()}`}
                                        </div>
                                        {/* <div className={styles.buttonHandler}>
                                            <button className={styles.buttons}>Send a Friend Request</button>
                                            <button className={styles.buttons}>Message</button>
                                        </div> */}
                                    </>
                                ) : activeView === "games" ? (
                                    <>
                                        Games
                                    </>
                                ) : (
                                    <>
                                        Achievements
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};