import { Link } from "react-router-dom";
import navStyle from "css/navi.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp } from "@fortawesome/free-solid-svg-icons";
import { useScroll } from "hooks/useScroll/useScroll";

const Navigation = ({userObj}) => {
    const y = useScroll();
    const onToUp = () => {
        window.scrollTo(0, 0);
    };
    return (
        <>
            <nav className={navStyle.nav}>
                <ul className={navStyle.ul}>
                    <li className={navStyle.li}>
                        <Link to="/" className={navStyle.a}>홈</Link>
                    </li>
                    <li className={navStyle.li}>
                        <Link to="/profile" className={navStyle.a}>{userObj.displayName}의 프로필</Link>
                    </li>
                </ul>
            </nav>
            <button className={y < 200 ? `${navStyle.toUp}` : `${navStyle.toUp} ${navStyle.show}`} type="button" onClick={onToUp}><FontAwesomeIcon icon={faAnglesUp} /></button>
        </>
    );
}
export default Navigation;