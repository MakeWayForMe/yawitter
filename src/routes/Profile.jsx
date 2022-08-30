import { deleteUser, signOut, updateProfile } from "firebase/auth";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { authService, dbService, storageService } from "mybase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileStyle from "css/profile.module.css";
import Yaweet from "components/Yaweet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Profile = ({ userObj, refreshUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [myYaweets, setMyYaweets] = useState([]);
    const [newPhoto, setNewPhoto] = useState("")
    const [complete, setComplete] = useState(false);
    const [num, setNum] = useState(5)
    const navigate = useNavigate();
    const onLogOutClick = () => {
        signOut(authService);
        navigate("/");
    };
    const onAuthDelete = async() => {
        const ok = window.confirm("정말 탈퇴하실건가요? 작성한 피드는 삭제되지 않습니다.");
        if(ok) {
            await deleteUser(authService.currentUser);
            navigate("/");
        }
    };
    const getMyYaweet = async() => {
        const q = query(
            collection(dbService, "yaweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const myYaweet = snapshot.docs.map((doc) => ({
                id:doc.id,
                displayName: doc.displayName,
                ...doc.data(),
            }));
            setMyYaweets(myYaweet);
        });
    };
    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
          setNum((prev) => prev + 3);
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },[]);
    useEffect(() => {
        getMyYaweet();
    }, [])
    const onChange = (event) => {
        const {value} = event.target;
        if(value.length <= 10) {
            setNewDisplayName(value);
        }
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName || newPhoto !== "") {
            if(userObj.displayName !== newDisplayName){
                if(newDisplayName !== "") {
                    await updateProfile(userObj, {displayName: newDisplayName, photoURL:userObj.photoURL});
                    myYaweets.forEach((yaweet) => {
                        updateDoc(doc(dbService, "yaweets",`${yaweet.id}`), {displayName: newDisplayName});
                    });
                    setComplete(true);
                } else {
                    alert("변경할 닉네임을 입력하세요")
                }
            }
            if(newPhoto !== ""){
                const photoRef = ref(storageService, `${userObj.uid}/profilePhoto`);
                const response = await uploadString(photoRef, newPhoto, "data_url");
                const photoURL = await getDownloadURL(response.ref);
                await updateProfile(userObj, {displayName: userObj.displayName, photoURL});
                myYaweets.forEach((yaweet) => {
                    updateDoc(doc(dbService, "yaweets",`${yaweet.id}`), {photoURL});
                });
                setComplete(true);
            }
            refreshUser();
        } else {
            setComplete(false);
        }
    };
    const onFileChange = (event) => {
        const theFile = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            setNewPhoto(finishedEvent.target.result);
        };
        reader.readAsDataURL(theFile);
    };
    return (
        <>
            <form onSubmit={onSubmit} className={profileStyle.form}>
                <div className={profileStyle.profileImg}>
                    <img src={newPhoto ? newPhoto : userObj.photoURL} alt="프로필" width="100%" />
                    <label htmlFor="profileImg"><FontAwesomeIcon icon={faPlus} /></label>
                    <input style={{display:'none'}} id="profileImg" type="file" accept="image/*" onChange={onFileChange} />
                </div>
                <p className={profileStyle.email}>{userObj.email}</p>
                <input className={profileStyle.name} type="text" placeholder="닉네임 입력" value={newDisplayName} onChange={onChange} />
                {complete && <p className={profileStyle.complete}><FontAwesomeIcon icon={faCircleCheck} /> 변경이 완료되었습니다.</p>}
                <button className={profileStyle.submit} type="submit" >정보 수정</button>
                <div className={profileStyle.buttons}>
                    <button type="button" onClick={onLogOutClick}>로그아웃</button>
                    <button type="button" onClick={onAuthDelete}>회원탈퇴</button>
                </div>
            </form>
            <div>
                {myYaweets.map((myYaweet, index) => {
                    if(index < num) {
                        return (
                            <Yaweet key={myYaweet.id} yaweetObj={myYaweet} fileUrl={myYaweet.fileUrl} userObj={userObj} isOwner={true} />
                        )}
                    }
                )}
            </div>
        </>
    );
}

export default Profile;