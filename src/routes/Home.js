import Yaweet from "components/Yaweet";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "mybase";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

const Home = ({ userObj }) => {
    const [yaweet, setYaweet] = useState("");
    const [yaweets, setYaweets] = useState([]);
    const [file, setFile] = useState("");
    useEffect(() => {
        const q = query(
            collection(dbService, "yaweets"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const yaweetArr = snapshot.docs.map((doc) => ({
                id:doc.id,
                ...doc.data(),
            }));
            setYaweets(yaweetArr);
        });
    },[])
    const onSubmit = async(event) => {
        event.preventDefault();
        let fileUrl;
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
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="한줄 써주십쇼" maxLength="120" value={yaweet} onChange={onChange} />
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
                <input type="submit" value="Yaweet" />
                {file && <div>
                    <img src={file} alt="" width="250px" />
                    <button type="button" onClick={fileClear}>취소</button>
                    </div>}
            </form>
            <div>
                {yaweets.map((yaweet) => (
                    <Yaweet key={yaweet.id} yaweetObj={yaweet} fileUrl={yaweet.fileUrl} isOwner={yaweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};

export default Home;