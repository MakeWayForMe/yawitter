import Yaweet from "components/Yaweet";
import YaweetFactory from "components/YaweetFactory";
import { collection, limit, onSnapshot, orderBy, query, startAfter } from "firebase/firestore";
import { dbService } from "mybase";
import React, { useEffect, useState } from "react";
import yaweetStyle from "css/yaweet.module.css";
import { useBottomScrollListener } from "react-bottom-scroll-listener";


let lastVisible = undefined;

const Home = ({ userObj }) => {
    const [yaweets, setYaweets] = useState([]);
    const getNextPost = () => {
        let q;
        if (lastVisible === -1) {
            return;
        } else if (lastVisible) {
            q = query(collection(dbService, "yaweets"),orderBy("createdAt", "desc"),limit(2),startAfter(lastVisible));
        } else {
            q = query(collection(dbService, "yaweets"),orderBy("createdAt", "desc"),limit(5));
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
        <div className={yaweetStyle.yaweetArea}>
            <YaweetFactory userObj={userObj} />
            <div>
                {yaweets.map((yaweet, index) =>
                    <Yaweet key={yaweet.id} yaweetObj={yaweet} fileUrl={yaweet.fileUrl} isOwner={yaweet.creatorId === userObj.uid} userObj={userObj} />
                )}
            </div>
        </div>
    );
};

export default Home;