import React from "react";
import { Link } from "react-router-dom";
import navStyle from "css/navi.module.css";

const Navigation = ({userObj}) => (
    <nav className={navStyle.nav}>
        <ul className={navStyle.ul}>
            <li className={navStyle.li}>
                <Link to="/" className={navStyle.a}>홈</Link>
            </li>
            <li className={navStyle.li}>
                <Link to="/profile" className={navStyle.a}>{userObj.displayName}'s<br />프로필</Link>
            </li>
        </ul>
    </nav>
);

export default Navigation;