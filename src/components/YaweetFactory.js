import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "mybase";
import React, { useRef, useState } from "react";
import { v4 } from "uuid";
import yaweetStyle from "css/yaweet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherPointed, faLink, faXmark } from "@fortawesome/free-solid-svg-icons";

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
                createdAt: Date(),
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
            <label className={yaweetStyle.file} htmlFor="file"><FontAwesomeIcon icon={faLink} /></label>
            <input style={{display:'none'}} id="file" type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
            <button className={yaweetStyle.upload} type="submit"><FontAwesomeIcon icon={faFeatherPointed} /></button>
            {file && (
                <div className={yaweetStyle.img}>
                    <img src={file} alt="" width="250px" />
                    <button type="button" onClick={fileClear}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
            )}
        </form>
    );
};

export default YaweetFactory;