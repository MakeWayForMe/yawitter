import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import {authService} from "mybase";
import { onAuthStateChanged } from "firebase/auth";
import "css/main.css";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);
    const [newDisplayName, setNewDisplayName] = useState("");
    useEffect(() => {
        onAuthStateChanged(authService, (user) => {
        if(user) {
            setUserObj(user);
        } else {
            setUserObj(null);
        }
        setInit(true);
        })
    },[])
    const refreshUser = () => {
        setNewDisplayName(userObj.displayName);
    }
    return (
        <>
        {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "로딩중..."}
        {/* <footer>&copy; {new Date().getFullYear()} Yawitter</footer> */}
        </>
    );
}

export default App;
