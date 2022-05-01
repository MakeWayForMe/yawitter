import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "mybase";
import React, { useRef, useState } from "react";
import { v4 } from "uuid";

const YaweetFactory = ({userObj}) => {
    const [yaweet, setYaweet] = useState("");
    const [file, setFile] = useState("");
    const onSubmit = async(event) => {
        event.preventDefault();
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
            fileUrl
        };
        await addDoc(collection(dbService, "yaweets"), yaweetObj);
        setYaweet("");
        setFile("");
        fileInput.current.value = "";
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
            <input type="text" placeholder="한줄 써주십쇼" maxLength="120" value={yaweet} onChange={onChange} />
            <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
            <input type="submit" value="Yaweet" />
            {file && <div>
                <img src={file} alt="" width="250px" />
                <button type="button" onClick={fileClear}>취소</button>
                </div>}
        </form>
    );
};

export default YaweetFactory;