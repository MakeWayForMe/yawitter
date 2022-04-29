import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { dbService, storageService } from "mybase";
import React, { useState } from "react";

const Yaweet = ({yaweetObj, isOwner, fileUrl}) => {
    const [editing, setEditing] = useState(false);
    const [newYaweet, setNewYaweet] = useState(yaweetObj.text);
    const yaweetTextRef = doc(dbService, "yaweets", `${yaweetObj.id}`);
    const onDeleteClick = async() => {
        const ok = window.confirm("삭제함?");
        if(ok) {
            await deleteDoc(yaweetTextRef);
            await deleteObject(ref(storageService, yaweetObj.fileUrl));
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
    return (
    <div>
        {
            editing ?(
                <>
                    <form onSubmit={onSubmit}>
                        <input type="text" placeholder="수정할 내용 쓰십쇼" value={newYaweet} required onChange={onChange} />
                        <input type="submit" value="Update Yaweet" />
                    </form>
                    <button type="button" onClick={toggleEdit}>취소</button>
                    { fileUrl && <img src={yaweetObj.fileUrl} alt="" width="250px" /> }
                </>
            )
             : (
                <>
                    <h4>{yaweetObj.text}</h4>
                    { fileUrl && <img src={yaweetObj.fileUrl} alt="" width="250px" /> }
                    { isOwner && (
                        <>
                        <button type="button" onClick={toggleEdit}>수정</button>
                        <button type="button" onClick={onDeleteClick}>삭제</button>
                        </>
                    )}
                </>
            )
        }
    </div>
    );
};

export default Yaweet;