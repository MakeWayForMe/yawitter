import { useLocation } from "react-router-dom";
import profileStyle from "css/profile.module.css";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Yaweet from "components/Yaweet";
import { dbService } from "mybase";

const OtherProfile = ({userObj}) => {
    const data = useLocation();
    const yaweetObj = data.state.yaweetObj;
    const [yaweets, setYaweets] = useState([]);
    const getYaweet = async() => {
        const q = query(
            collection(dbService, "yaweets"),
            where("creatorId", "==", yaweetObj.creatorId),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const yaweet = snapshot.docs.map((doc) => ({
                id:doc.id,
                displayName: doc.displayName,
                ...doc.data(),
            }));
            setYaweets(yaweet);
        });
    };
    useEffect(() => {
        getYaweet();
    }, []);
    return (
        <>
            <div className={profileStyle.form}>
                <div className={profileStyle.profileImg}>
                    <img src={yaweetObj.photoURL} alt="프로필" width="100%" />
                </div>
                <p className={profileStyle.name}>{yaweetObj.displayName}</p>
            </div>
            <div>
                {yaweets.map((yaweet) => (
                    <Yaweet key={yaweet.id} yaweetObj={yaweet} fileUrl={yaweet.fileUrl} userObj={userObj} />
                ))}
            </div>
        </>
    );
};

export default OtherProfile;