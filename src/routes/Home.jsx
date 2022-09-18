import Yaweet from "components/Yaweet";
import YaweetFactory from "components/YaweetFactory";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { dbService } from "mybase";
import React, { useEffect, useState } from "react";
import yaweetStyle from "css/yaweet.module.css";

const Home = ({ userObj }) => {
    const [yaweets, setYaweets] = useState([]);
    const [num, setNum] = useState(5)
    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 100) {
          setNum((prev) => prev + 3);
        }
    };
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
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },[]);
    return (
        <div className={yaweetStyle.yaweetArea}>
            <YaweetFactory userObj={userObj} />
            <div>
                {yaweets.map((yaweet, index) => {
                    if(index < num) {
                        return (
                            <Yaweet key={yaweet.id} yaweetObj={yaweet} fileUrl={yaweet.fileUrl} isOwner={yaweet.creatorId === userObj.uid} userObj={userObj} />
                        )}
                    }
                )}
            </div>
        </div>
    );
};

export default Home;