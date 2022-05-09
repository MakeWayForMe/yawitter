import React from "react";
import { HashRouter as Router, Routes, Route} from "react-router-dom";
import Home from "routes/Home";
import Auth from "routes/Auth";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";

const AppRouter = ({refreshUser, isLoggedIn, userObj}) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route exact={true} path="/" element={<Home userObj={userObj} />} />
                        <Route exact={true} path="/profile"element={<Profile userObj={userObj} refreshUser={refreshUser} />} />
                    </>
                ) : (
                    <>
                        <Route exact={true} path="/" element={<Auth />} />
                    </>
                )}
            </Routes>
        </Router>
    )
};

export default AppRouter;