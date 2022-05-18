import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "mybase";
import React, { useRef, useState } from "react";
import yaweetStyle from "css/yaweet.module.css";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherPointed, faLink, faPencil, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";

const Yaweet = ({yaweetObj, isOwner, fileUrl, userObj}) => {
    const [editing, setEditing] = useState(false);
    const [newYaweet, setNewYaweet] = useState(yaweetObj.text);
    const [newFile, setNewFile] = useState("");
    const yaweetTextRef = doc(dbService, "yaweets", `${yaweetObj.id}`);
    const onDeleteClick = async() => {
        const ok = window.confirm("삭제함?");
        if(ok) {
            await deleteDoc(yaweetTextRef);
            if(fileUrl){
                await deleteObject(ref(storageService, fileUrl));
            }
        }
    };
    const toggleEdit = () => setEditing((prev) => !prev);;
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
        setNewYaweet(value);
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
    };
    return (
    <div>
        {
            editing ? (
                <div className={yaweetStyle.yaweetBox}>
                    <div className="editing">
                        <h2 className={yaweetStyle.writer}>{yaweetObj.displayName}</h2>
                        <form onSubmit={onSubmit}>
                            <textarea className={yaweetStyle.reTextarea} placeholder="수정할 내용 쓰십쇼" value={newYaweet} required onChange={onChange} />
                            <label className={yaweetStyle.file} htmlFor="reFile"><FontAwesomeIcon icon={faLink} /></label>
                            <input style={{display:'none'}} id="reFile" type="file" accept="image/*" onChange={onFileReChange} ref={fileInput} />
                            <button className={yaweetStyle.upload} type="submit"><FontAwesomeIcon icon={faFeatherPointed} /></button>
                            { (yaweetObj.fileUrl, newFile) &&
                            <div className={yaweetStyle.img}>
                                { newFile ? <img src={newFile} alt="" /> : <img src={yaweetObj.fileUrl} alt="" />}
                                <button type="button"><FontAwesomeIcon icon={faXmark} onClick={clearImg} /></button>
                            </div>
                            }
                        </form>
                    </div>
                    <div className={yaweetStyle.editRemove}>
                        <button type="button" onClick={toggleEdit}><FontAwesomeIcon icon={faXmark} /></button>
                    </div>
                </div>
            )
             : (
                <div className={yaweetStyle.yaweetBox}>
                    <div className="wrote">
                        <h2 className={yaweetStyle.writer}>{yaweetObj.displayName}</h2>
                        <h4>
                            {yaweetObj.text.split("\n").map((line) => {
                                return <span key={v4()}>{line}<br /></span>;
                            })}
                        </h4>
                    </div>
                    { fileUrl && <img src={yaweetObj.fileUrl} alt="" width="49%" /> }
                    { isOwner && (
                    <div className={yaweetStyle.editRemove}>
                        <button type="button" onClick={onDeleteClick}><FontAwesomeIcon icon={faTrashCan} /></button>
                        <button type="button" onClick={toggleEdit}><FontAwesomeIcon icon={faPencil} /></button>
                    </div>
                    )}
                    <p className={yaweetStyle.date}>{writeDate(yaweetObj.createdAt)}</p>
                </div>
            )
        }
    </div>
    );
};

export default Yaweet;