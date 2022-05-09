import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { dbService, storageService } from "mybase";
import React, { useState } from "react";
import yaweetStyle from "css/yaweet.module.css";
import { v4 } from "uuid";

const Yaweet = ({yaweetObj, isOwner, fileUrl}) => {
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
        const date = new Date(time*1000);
        const writeYear = String(date.getFullYear()),
              writeMonth = String(date.getMonth()),
              writeDay = String(date.getDate()),
              writeHour = String(date.getHours()).padStart(2, "0"),
              wirteMinute = String(date.getMinutes()).padStart(2, "0");
        console.log(writeYear);
        return `${writeYear}년 ${Number(writeMonth) + 1}월 ${writeDay}일 ${writeHour}:${wirteMinute}`;
    }
    return (
    <div>
        {
            editing ?(
                <div className={yaweetStyle.yaweetBox}>
                    <form onSubmit={onSubmit}>
                        <textarea className={yaweetStyle.reTextarea} placeholder="수정할 내용 쓰십쇼" value={newYaweet} required onChange={onChange} />
                        <input className={yaweetStyle.reUpload} type="submit" value="수정 후 업로드" />
                    </form>
                    { fileUrl && <img src={yaweetObj.fileUrl} alt="" width="250px" /> }
                    <div>
                        <button type="button" onClick={toggleEdit}>수정 취소</button>
                    </div>
                </div>
            )
             : (
                <div className={yaweetStyle.yaweetBox}>
                    <div className={fileUrl ? yaweetStyle.ari : yaweetStyle.nasi }>
                        <h2 className={yaweetStyle.writer}>{yaweetObj.displayName}</h2>
                        <h4>
                            {yaweetObj.text.split("\n").map((line) => {
                                return <span key={v4()}>{line}<br /></span>;
                            })}
                        </h4>
                    </div>
                    { fileUrl && <img src={yaweetObj.fileUrl} alt="" width="250px" /> }
                    { isOwner && (
                    <div className={yaweetStyle.editRemove}>
                        <button type="button" onClick={onDeleteClick}>삭제</button>
                        <button type="button" onClick={toggleEdit}>수정</button>
                    </div>
                    )}
                    <p className={yaweetStyle.date}>{writeDate(yaweetObj.createdAt.seconds)}</p>
                </div>
            )
        }
    </div>
    );
};

export default Yaweet;