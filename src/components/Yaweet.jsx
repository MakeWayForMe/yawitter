import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "mybase";
import React, { useRef, useState } from "react";
import yaweetStyle from "css/yaweet.module.css";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherPointed, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faHeart as unLike, faImage } from "@fortawesome/free-regular-svg-icons";
import { faHeart as Liked } from "@fortawesome/free-solid-svg-icons";
import { BoxHeader } from "./BoxHeader";
import { BoxFooter } from "./BoxFooter";

const Yaweet = ({yaweetObj, isOwner, fileUrl, userObj}) => {
    const [editing, setEditing] = useState(false);
    const [newYaweet, setNewYaweet] = useState(yaweetObj.text);
    const [newFile, setNewFile] = useState("");
    const [isImg, setIsImg] = useState(false);
    const [zoom, setZoom] = useState(false);
    const [likelist, setLikelist] = useState(false);
    const yaweetTextRef = doc(dbService, "yaweets", `${yaweetObj.id}`);
    const onDeleteClick = async() => {
        const ok = window.confirm("피드를 삭제하시겠습니까? 삭제한 피드는 복원할 수 없습니다.");
        if(ok) {
            await deleteDoc(yaweetTextRef);
            if(fileUrl){
                await deleteObject(ref(storageService, fileUrl));
            }
        }
    };
    const editOn = () => {
        setEditing(true);
        if(yaweetObj.fileUrl) {
            setIsImg(true);
        } else {
            setIsImg(false);
        }
    };
    const editOff = () => {
        setEditing(false);
        setIsImg(false);
        setNewYaweet(yaweetObj.text);
        if(yaweetObj.fileUrl !== fileUrl) {
            yaweetObj.fileUrl = fileUrl;
        }
    };
    const zoomIn = () => {
        setZoom(true);
    };
    const zoomOut = () => {
        setZoom(false);
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        if(yaweetObj.fileUrl || newFile) {
            if(newFile !== "") {
                if(yaweetObj.fileUrl !== "") {
                    await deleteObject(ref(storageService, fileUrl));
                }
                const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
                const response = await uploadString(fileRef, newFile, "data_url");
                fileUrl = await getDownloadURL(response.ref);
            }
            await updateDoc(yaweetTextRef, {
                text: newYaweet,
                fileUrl
            });
        } else {
            if(fileUrl) {
                await deleteObject(ref(storageService, fileUrl));
            }
            await updateDoc(yaweetTextRef, {
                text: newYaweet,
                fileUrl: ""
            });
        }
        setNewFile("");
        setEditing(false);
    };
    const onChange = (event) => {
        const { value } = event.target;
        if(value.length <= 200) {
            setNewYaweet(value);
        }
    };
    const writeDate = (time) => {
        const date = new Date(time);
        const writeYear = date.getFullYear(),
              writeMonth = date.getMonth(),
              writeDay = date.getDate(),
              writeHour = String(date.getHours()).padStart(2, "0"),
              wirteMinute = String(date.getMinutes()).padStart(2, "0");
        return `${writeYear}년 ${writeMonth + 1}월 ${writeDay}일 ${writeHour}:${wirteMinute}`;
    };
    const onFileReChange = (event) => {
        setIsImg(true);
        const theFile = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            setNewFile(finishedEvent.target.result);
        };
        reader.readAsDataURL(theFile);
    };
    const fileInput = useRef();
    const clearImg = () => {
        setNewFile("");
        fileInput.current.value = "";
        yaweetObj.fileUrl = "";
        setIsImg(false);
    };
    const onLike = () => {
        const likeList = yaweetObj.like;
        const uidList = likeList.map((list) => list.uid)
        if(uidList.includes(userObj.uid)) {
            updateDoc(yaweetTextRef, {like: likeList.filter(list => list.uid !== userObj.uid)});
        } else {
            updateDoc(yaweetTextRef, {like: [{name: userObj.displayName, photo:userObj.photoURL, uid:userObj.uid}, ...likeList]});
        }
    };
    const toggleLikelist = () => {
        setLikelist((prev) => !prev);
    };
    return (
    <>
        {
            editing ? (
                <div className={yaweetStyle.yaweetBox}>
                    <div className="editing">
                        <BoxHeader yaweetStyle={yaweetStyle} yaweetObj={yaweetObj} />
                        <form onSubmit={onSubmit}>
                            <textarea className={yaweetStyle.reTextarea} placeholder="수정할 내용을 입력해주세요" value={newYaweet} required onChange={onChange} />
                            <label className={yaweetStyle.file} htmlFor="reFile"><FontAwesomeIcon icon={faImage} /></label>
                            <input style={{display:'none'}} id="reFile" type="file" accept="image/*" onChange={onFileReChange} ref={fileInput} />
                            <button className={yaweetStyle.upload} type="submit"><FontAwesomeIcon icon={faFeatherPointed} /></button>
                            { isImg &&
                            <div className={yaweetStyle.img}>
                                { newFile ? <img src={newFile} alt="첨부이미지" /> : <img src={yaweetObj.fileUrl} alt="첨부이미지" />}
                                <button type="button"><FontAwesomeIcon icon={faXmark} onClick={clearImg} /></button>
                            </div>
                            }
                            <p className={yaweetStyle.length}>({newYaweet.length}/200)</p>
                        </form>
                    </div>
                    <BoxFooter editing={editing} yaweetStyle={yaweetStyle} editOff={editOff} />
                </div>
            )
             : (
                <div className={yaweetStyle.yaweetBox}>
                    <div>
                        <Link to={userObj.uid === yaweetObj.creatorId ? "/profile" : `/profile/${yaweetObj.creatorId}`} state={{yaweetObj}}>
                            <BoxHeader yaweetStyle={yaweetStyle} yaweetObj={yaweetObj} />
                        </Link>
                        <p>
                            {yaweetObj.text.split("\n").map((line) => {
                                return <span key={v4()}>{line}<br /></span>;
                            })}
                        </p>
                    </div>
                    <div className={yaweetStyle.like}>
                        <button type="button" onClick={onLike}>{yaweetObj.like.map((list) => list.uid).includes(userObj.uid) ? <FontAwesomeIcon icon={Liked} /> : <FontAwesomeIcon icon={unLike} />}</button>
                        { yaweetObj.like.length > 0 && <span onClick={toggleLikelist}>{yaweetObj.like.length} 좋아요</span>}
                    </div>
                    { likelist &&
                    <div className={yaweetStyle.likelist}>
                        <button type="button" onClick={toggleLikelist}><FontAwesomeIcon icon={faXmark} /></button>
                        <ul>
                            {yaweetObj.like.map((list) => (
                                <li key={list.uid}><img src={list.photo} alt="프로필사진" />{list.name}</li>
                            ))}
                        </ul>
                    </div>
                    }
                    { fileUrl && (
                    <div className={yaweetStyle.wroteFile}>
                        <img src={yaweetObj.fileUrl} alt="첨부이미지" />
                        <button type="button" onClick={zoomIn}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                    </div>
                    )}
                    { isOwner && (
                        <BoxFooter editing={editing} yaweetStyle={yaweetStyle} editOn={editOn} onDeleteClick={onDeleteClick} />
                    )}
                    <p className={yaweetStyle.date}>{writeDate(yaweetObj.createdAt)}</p>
                    { zoom && (
                    <div className={yaweetStyle.zoom}>
                        <img src={yaweetObj.fileUrl} />
                        <button type="button" onClick={zoomOut}><FontAwesomeIcon icon={faXmark} /></button>
                    </div>
                    )}
                </div>
            )
        }
    </>
    );
};

export default Yaweet;