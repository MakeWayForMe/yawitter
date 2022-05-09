import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { authService, dbService } from "mybase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileStyle from "css/profile.module.css";

const Profile = ({ userObj, refreshUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const navigate = useNavigate();
    const onLogOutClick = () => {
        signOut(authService);
        navigate("/");
    };
    const getMyYaweet = async() => {
        const q = query(
            collection(dbService, "yaweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        );
        // const querySnapShot = await getDocs(q);
    };
    useEffect(() => {
        getMyYaweet();
    }, [])
    const onChange = (event) => {
        const {value} = event.target;
        setNewDisplayName(value);
    }
    const onSubmit = async(event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(userObj, {displayName: newDisplayName});
        }
        refreshUser();
    };
    return (
        <>
            <form onSubmit={onSubmit}>
                <input className={profileStyle.input} type="text" placeholder="닉네임 입력" value={newDisplayName} onChange={onChange} />
                <input className={profileStyle.name} type="submit" value="닉네임 수정" />
            </form>
            <button className={profileStyle.logOutBtn} type="button" onClick={onLogOutClick}>로그아웃</button>
        </>
    );
}

export default Profile;