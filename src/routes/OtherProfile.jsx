import { useLocation } from "react-router-dom";
import profileStyle from "css/profile.module.css";
import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore";
import Yaweet from "components/Yaweet";
import { dbService } from "mybase";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

const OtherProfile = ({userObj}) => {
    let lastVisible = undefined;
    const data = useLocation();
    const yaweetObj = data.state.yaweetObj;
    const [yaweets, setYaweets] = useState([]);

    const getNextPost = () => {
        let q;
        if (lastVisible === -1) {
            return;
        } else if (lastVisible) {
            q = query(collection(dbService, "yaweets"),where("creatorId", "==", yaweetObj.creatorId),orderBy("createdAt", "desc"),limit(2),startAfter(lastVisible));
        } else {
            q = query(collection(dbService, "yaweets"),where("creatorId", "==", yaweetObj.creatorId),orderBy("createdAt", "desc"),limit(5));
        }
        onSnapshot(q, (snapshot) => {
            const yaweetArr = snapshot.docs.map((doc) => ({
                id:doc.id,
                displayName: doc.displayName,
                ...doc.data(),
            }));
            const arr = [...yaweets, ...yaweetArr]
            setYaweets(arr);
            if(snapshot.docs.length === 0) {
                lastVisible = -1;
            } else {
                lastVisible = snapshot.docs[snapshot.docs.length - 1]
            }
        });
    }

    useBottomScrollListener(getNextPost);

    useEffect(() => {
        getNextPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
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