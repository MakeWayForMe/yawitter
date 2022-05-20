import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import {authService} from "mybase";
import { onAuthStateChanged } from "firebase/auth";
import "css/main.css";
import { v4 } from "uuid";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);
    const [newDisplayName, setNewDisplayName] = useState("");
    useEffect(() => {
        onAuthStateChanged(authService, (user) => {
        if(user) {
            setUserObj(user);
            if(user.displayName == null) {
                user.displayName = `사용자 ${v4().slice(0,8)}`;
            }
            if(user.photoURL == null) {
                user.photoURL = `https://myabilitieswa.com.au/wp-content/uploads/2017/06/default-profile-pic-e1513291410505.jpg`;
            }
        } else {
            setUserObj(null);
        }
        setInit(true);
        })
    },[]);
    const refreshUser = () => {
        setNewDisplayName(userObj.displayName);
    };
    return (
        <>
        {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "로딩중..."}
        <footer>&copy; {new Date().getFullYear()} Yawitter</footer>
        </>
    );
}

export default App;
