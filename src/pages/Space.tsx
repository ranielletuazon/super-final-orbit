import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../components/firebase/firebase";
import { getDoc, doc, collection, getDocs, Timestamp} from "firebase/firestore";
import { toast } from "sonner";
import styles from './css/Space.module.css';
import { set } from "firebase/database";

import game2 from '../assets/dota.jpg'
import game3 from '../assets/minecraft.jpg'
import game4 from '../assets/league.jpeg'
import player from '../assets/bunja.webp'
import valorant from '../assets/tejo.png'


import Header from '../components/Header';

export default function Space({ user }: { user: any }) {

    interface UserData{
        username: string,
        id: string,
        email?: string;
        emailConsent?: boolean;
    }

    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [suggested, setSuggested] = useState<string[]>([]);
    const [playerData, setPlayerData] = useState<any[]>([]);
    const [completeLoad, setCompleteLoad] = useState(true);

    const test: boolean = false;

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

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

    // Check if this code still important?
    useEffect(() => {
        const fetchUserData = async () => {
            if (!auth.currentUser) return; // Ensure user is authenticated

            const userDocRef = doc(db, "user", auth.currentUser.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const userData = docSnap.data() as UserData;
                setCurrentUser(userData);

                // Check if the emailConsent field exists
                if (userData.emailConsent === undefined || userData.emailConsent === false) {
                    // Redirect to /setup if emailConsent does not exist or is false
                    navigate("/setup");
                }
            } else {
                console.log("No such document!");
            }
        };
        fetchUserData();
        setCompleteLoad(false);
    }, [navigate]);

    // Get random 5
    useEffect(() => {
        const fetchData = async () => {
          try {
            // Check if data was fetched today
            const lastFetched = localStorage.getItem("lastFetched");
            const today = new Date().toLocaleDateString(); // Format as "MM/DD/YYYY"
    
            // If data was fetched today, load it from localStorage
            if (lastFetched === today) {
              const storedPlayerData = localStorage.getItem("playerData");
              if (storedPlayerData) {
                setPlayerData(JSON.parse(storedPlayerData));
                console.log("Using cached player data.");
                return;
              }
            }
    
            // Fetching the user documents from Firestore
            const playersSnap = await getDocs(collection(db, "user"));
            const playersList = playersSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
    
            // Selecting 5 random players
            const randomFive: string[] = [];
            while (randomFive.length < 5 && playersList.length > randomFive.length) {
              const randomId = playersList[Math.floor(Math.random() * playersList.length)].id;
              if (!randomFive.includes(randomId)) {
                randomFive.push(randomId);
              }
            }
    
            setSuggested(randomFive);
            console.log("Suggested Players:", randomFive);
    
            // Fetching player data for the selected random player IDs
            const playersData = await Promise.all(randomFive.map(async (uid) => {
              const playerDocRef = doc(db, "user", uid);
              const playerSnap = await getDoc(playerDocRef);
    
              if (playerSnap.exists()) {
                return playerSnap.data();
              } else {
                return null;
              }
            }));
    
            // Filter out any null values if a player doesn't have data
            const filteredPlayersData = playersData.filter((player): player is any => player !== null);
    
            setPlayerData(filteredPlayersData);
            console.log("Player Data:", filteredPlayersData);
    
            // Store the player data and the current date in localStorage
            localStorage.setItem("playerData", JSON.stringify(filteredPlayersData));
            localStorage.setItem("lastFetched", today);
          } catch (error) {
            console.error("Error fetching players:", error);
          }
        };
    
        fetchData();
    }, []);

    console.log(playerData);

    


    
    return(
        <>
            <div className={styles.container}>
                <div className={styles.page}>
                    <div className={styles.pageContainer}>
                        <Header logout={() => handleLogout()} user={user} />
                        <div className={styles.main}>
                            <div className={styles.mainHeader}>
                                <div className={styles.intro}>Welcome back, <span style={{color: "white"}}>{currentUser?.username?.toUpperCase()}</span></div>
                                <div className={styles.sideButtons}>
                                    <button className="fa-solid fa-bell"></button>
                                    <button className="fa-solid fa-comment-dots"></button>
                                    <button className="fa-solid fa-user-group"></button>
                                </div>
                            </div>
                            <div className={styles.gameSection}>
                                <div className={styles.popular}>
                                    <img src={valorant} alt="Valorant" className={styles.popularImage} />
                                    <div className={styles.popularSection}>
                                        <div className={styles.popularTag}>
                                            <i className="fa-solid fa-fire"></i>
                                            Popular
                                        </div>
                                    </div>
                                    <div className={styles.popularTitle}>
                                        <div className={styles.gameTitle}>Valorant</div>
                                    </div>
                                    <div className={styles.descriptionSection}>
                                        <div className={styles.description}>Valorant is an online multiplayer computer game, produced by Riot Games. It is a first-person shooter game, consisting of two teams of five, where one team attacks and the other defends. Players control characters known as 'agents', who all have different abilities to use during gameplay.</div>
                                    </div>
                                    <div className={styles.playersSection}>
                                        <div className={styles.playerCircles}>
                                            <div className={styles.player}></div>
                                            <div className={styles.player} style={{marginLeft: "-2rem"}}></div>
                                            <div className={styles.player} style={{marginLeft: "-2rem"}}></div>
                                        </div>
                                        <div className={styles.playersInfo}> +85 more looking for Valorant</div>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <div className={styles.gameBox}>
                                        <img src={game2} alt="Game" className={styles.gameboximage}/>
                                        <div className={styles.gameboxtitle}>Dota 2</div>
                                        <div className={styles.gameboxplayercount}>20 players</div>
                                        <div className={styles.view}><i className="fa-solid fa-eye"></i> View</div>
                                    </div>
                                    <div className={styles.gameBox}>
                                        <img src={game3} alt="Game" className={styles.gameboximage}/>
                                        <div className={styles.gameboxtitle}>Minecraft</div>
                                        <div className={styles.gameboxplayercount}>15 players</div>
                                        <div className={styles.view}><i className="fa-solid fa-eye"></i> View</div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.userHeader}>Players for You Today</div>
                            <div className={styles.playerSection}> {/* Maximum of 5 */}
                                { playerData && playerData.map((item, index) => (
                                    <div key={index} className={styles.playerDisplay} style={{backgroundImage: `url(${item.profileImage})`}}>
                                        <div className={styles.playerDescription}>
                                            <div className={styles.playerUsername}><b>{item.username}, 25 {item.gender && item.gender.toLowerCase() === "male" ? (<i className="fa-solid fa-mars" style={{color: "#2cc6ff", marginLeft: "0.5rem"}}></i>) : (<i className="fa-solid fa-venus" style={{color: "hsl(0, 100%, 70%)", marginLeft: "0.5rem"}}></i>)}</b></div>
                                            <button className={styles.playerAdd}><i className="fa-solid fa-user-plus"></i></button>
                                        </div>
                                    </div>
                                ))}
                                {/* <div className={styles.playerDisplay} style={{backgroundImage: `url(${player})`}}>
                                    <div className={styles.playerDescription}>
                                        <div className={styles.playerUsername}><b>Bunja</b> 25</div>
                                        <div className={styles.playerGames}>Valorant</div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    {/* <Header logout={() => handleLogout()}/>
                    {!completeLoad ? (
                        <>
                            <div className={styles.header}></div>
                        </>
                    ) : (
                        <>
                            Loading...
                        </>
                    )} */}
                </div>
            </div>
        </>
    );
}