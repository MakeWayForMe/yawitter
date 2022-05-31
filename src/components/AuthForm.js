import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { authService } from "mybase";
import React, { useState } from "react";
import loginStyle from "css/main.module.css";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setdisplayName] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {name, value} = event.target;
        if(name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        } else if (name === "displayName") {
            if(value.length <= 10) {
                setdisplayName(value);
            }
        }
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        try {
            let data;
            if(newAccount) {
                data = await createUserWithEmailAndPassword(authService, email, password);
            } else {
                data = await signInWithEmailAndPassword(authService, email, password);
            }
        } catch(error) {
            if(error.message == "Firebase: Error (auth/email-already-in-use).") {
                setError("이미 가입된 계정입니다.");
            } else {
                setError("존재하지 않는 계정이거나 비밀번호가 일치하지 않습니다.");
            }
        }
    };
    const toggleAccount = () => {
        setNewAccount((prev) => !prev);
        setEmail("");
        setPassword("");
        setdisplayName("");
        setError("");
    };
    return (
        <form onSubmit={onSubmit}>
            <input className={loginStyle.authInput} name="email" type="email" placeholder="아이디(이메일)" required value={email} onChange={onChange} />
            <input className={loginStyle.authInput} name="password" type="password" placeholder={newAccount ? "비밀번호(6자리 이상)" : "비밀번호"} required value={password} onChange={onChange} />
            {newAccount && <input className={loginStyle.authInput} name="displayName" type="text" placeholder="닉네임" required value={displayName} onChange={onChange} />}
            <input className={loginStyle.loginBtn} type="submit" value={newAccount ? "회원가입" : "로그인"} />
            <p className={loginStyle.error}>{error}</p>
            <button className={loginStyle.toggleBtn} type="button" onClick={toggleAccount}>{newAccount ? "이미 계정이 있으신가요?" : "계정이 없다면 지금바로 회원가입"}</button>
        </form>
    );
};

export default AuthForm;