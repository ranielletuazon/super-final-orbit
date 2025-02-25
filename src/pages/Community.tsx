import styles from "./css/Community.module.css";
import Header from '../components/Header';
import React, { useState, useEffect } from "react";

export default function Community({user}: {user: any}) {

    const [friends, setFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);

    return(
        <>
            <div className={styles.container}>
                <div className={styles.page}>
                    <div className={styles.pageContainer}>
                        <Header user={user} />
                        <div className={styles.content}>
                            <div className={styles.friendsHeader}>Friends</div>
                            <div className={styles.friendCardbox}>
                                {friends.length > 0 ? (
                                    <>

                                    </>
                                ) : (
                                    <>
                                        <div className={styles.friendContent}>No Friends Yet</div>
                                    </>
                                )}
                            </div>
                            <div className={styles.pendingFriends}>Pending</div>
                            <div className={styles.pendingCardbox}>
                                {friends.length > 0 ? (
                                    <>

                                    </>
                                ) : (
                                    <>
                                        <div className={styles.pendingContent}>No Sent Requests Yet</div>
                                    </>
                                )}
                            </div>
                            <div className={styles.requestsHeader}>Friend Requests</div>
                            <div className={styles.requestCardbox}>
                                {friends.length > 0 ? (
                                    <>

                                    </>
                                ) : (
                                    <>
                                        <div className={styles.requestContent}>No Sent Requests Yet</div>
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