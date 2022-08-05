import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import {authService} from "mybase";
import { onAuthStateChanged } from "firebase/auth";
import "css/global.css";
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
                user.displayName = `사용자 ${v4().slice(0,5)}`;
            }
            if(user.photoURL == null) {
                user.photoURL = "https://firebasestorage.googleapis.com/v0/b/yawitter.appspot.com/o/default_profile_pic.jpg?alt=media&token=1bcf6cc5-b9f0-49d9-b80f-6e87ca32e3ef";
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
        {init ? (
            <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} />
            ) : (
            <img className="loading" src={process.env.PUBLIC_URL + '/img/loading.gif'} alt="로딩중" />
            )
        }
        <footer>&copy; {new Date().getFullYear()} Yawitter</footer>
        </>
    );
}

export default App;
