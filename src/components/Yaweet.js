import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { dbService, storageService } from "mybase";
import React, { useState } from "react";
import yaweetStyle from "css/yaweet.module.css";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";

const Yaweet = ({yaweetObj, isOwner, fileUrl, ownerName}) => {
    const [editing, setEditing] = useState(false);
    const [newYaweet, setNewYaweet] = useState(yaweetObj.text);
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
    const toggleEdit = () => setEditing((prev) => !prev);
    const onSubmit = async(event) => {
        event.preventDefault();
        await updateDoc(yaweetTextRef, {text: newYaweet});
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
    }
    return (
    <div>
        {
            editing ?(
                <div className={yaweetStyle.yaweetBox}>
                    <form onSubmit={onSubmit}>
                        <h2 className={yaweetStyle.writer}>{ownerName}</h2>
                        <textarea className={yaweetStyle.reTextarea} placeholder="수정할 내용 쓰십쇼" value={newYaweet} required onChange={onChange} />
                        <input className={yaweetStyle.reUpload} type="submit" value="수정 후 업로드" />
                    </form>
                    { fileUrl && <img src={yaweetObj.fileUrl} alt="" width="49%" /> }
                    <div className={yaweetStyle.editRemove}>
                        <button type="button" onClick={toggleEdit}><FontAwesomeIcon icon={faXmark} /></button>
                    </div>
                </div>
            )
             : (
                <div className={yaweetStyle.yaweetBox}>
                    <div className={fileUrl ? yaweetStyle.ari : yaweetStyle.nasi }>
                        <h2 className={yaweetStyle.writer}>{ownerName}</h2>
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