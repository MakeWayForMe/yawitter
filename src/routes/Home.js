import Yaweet from "components/Yaweet";
import YaweetFactory from "components/YaweetFactory";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { dbService } from "mybase";
import React, { useEffect, useState } from "react";
import yaweetStyle from "css/yaweet.module.css";

const Home = ({ userObj }) => {
    const [yaweets, setYaweets] = useState([]);
    useEffect(() => {
        const q = query(
            collection(dbService, "yaweets"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const yaweetArr = snapshot.docs.map((doc) => ({
                id:doc.id,
                displayName: doc.displayName,
                ...doc.data(),
            }));
            setYaweets(yaweetArr);
        });
    },[]);
    return (
        <div className={yaweetStyle.yaweetArea}>
            <img src={process.env.PUBLIC_URL + '/img/logo.png'} alt="로고" />
            <YaweetFactory userObj={userObj} />
            <div>
                {yaweets.map((yaweet) => (
                    <Yaweet key={yaweet.id} yaweetObj={yaweet} fileUrl={yaweet.fileUrl} isOwner={yaweet.creatorId === userObj.uid} userObj={userObj} />
                ))}
            </div>
        </div>
    );
};

export default Home;