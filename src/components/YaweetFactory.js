import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "mybase";
import React, { useRef, useState } from "react";
import { v4 } from "uuid";
import yaweetStyle from "css/yaweet.module.css";

const YaweetFactory = ({userObj}) => {
    const [yaweet, setYaweet] = useState("");
    const [file, setFile] = useState("");
    const onSubmit = async(event) => {
        event.preventDefault();
        if(yaweet !== "") {
            let fileUrl = "";
            if(file !== ""){
                const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
                const response = await uploadString(fileRef, file, "data_url");
                fileUrl = await getDownloadURL(response.ref);
            }
            const yaweetObj = {
                text: yaweet,
                createdAt: serverTimestamp(),
                creatorId: userObj.uid,
                displayName: userObj.displayName,
                fileUrl
            };
            await addDoc(collection(dbService, "yaweets"), yaweetObj);
            setYaweet("");
            setFile("");
            fileInput.current.value = "";
        } else {
            alert("내용을 작성하셔야죠?")
        }
    };
    const onChange = (event) => {
        const { value } = event.target;
        setYaweet(value);
    };
    const onFileChange = (event) => {
        const theFile = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            setFile(finishedEvent.target.result);
        };
        reader.readAsDataURL(theFile);
    };
    const fileInput = useRef();
    const fileClear = () => {
        setFile("");
        fileInput.current.value = "";
    };

    return (
        <form onSubmit={onSubmit}>
            <textarea className={yaweetStyle.textarea} placeholder="내용입력" maxLength="120" value={yaweet} onChange={onChange} />
            <input className={yaweetStyle.file} type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
            <input className={yaweetStyle.upload} type="submit" value="업로드" />
            {file && (
                <div>
                    <img src={file} alt="" width="250px" />
                    <button type="button" onClick={fileClear}>취소</button>
                </div>
            )}
        </form>
    );
};

export default YaweetFactory;