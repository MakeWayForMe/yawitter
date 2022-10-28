import { deleteUser, signOut, updateProfile } from "firebase/auth";
import { collection, doc, limit, onSnapshot, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import { authService, dbService, storageService } from "mybase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileStyle from "css/profile.module.css";
import Yaweet from "components/Yaweet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

let lastVisible = undefined;

const Profile = ({ userObj, refreshUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [myYaweets, setMyYaweets] = useState([]);
    const [newPhoto, setNewPhoto] = useState("")
    const [complete, setComplete] = useState(false);
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

    const getMyYaweet = () => {
        let q;
        if (lastVisible === -1) {
            return;
        } else if (lastVisible) {
            q = query(collection(dbService, "yaweets"),where("creatorId", "==", userObj.uid),orderBy("createdAt", "desc"),limit(2),startAfter(lastVisible));
        } else {
            q = query(collection(dbService, "yaweets"),where("creatorId", "==", userObj.uid),orderBy("createdAt", "desc"),limit(5));
        }
        onSnapshot(q, (snapshot) => {
            const yaweetArr = snapshot.docs.map((doc) => ({
                id:doc.id,
                displayName: doc.displayName,
                ...doc.data(),
            }));
            const arr = [...myYaweets, ...yaweetArr]
            setMyYaweets(arr);
            if(snapshot.docs.length === 0) {
                lastVisible = -1;
            } else {
                lastVisible = snapshot.docs[snapshot.docs.length - 1]
            }
        });
    };

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

    useBottomScrollListener(getMyYaweet);

    useEffect(() => {
        getMyYaweet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

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
                {myYaweets.map((myYaweet, index) =>
                    <Yaweet key={myYaweet.id} yaweetObj={myYaweet} fileUrl={myYaweet.fileUrl} userObj={userObj} isOwner={true} />
                )}
            </div>
        </>
    );
}

export default Profile;