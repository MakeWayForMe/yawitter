import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { authService } from "mybase";
import React, { useState } from "react";
import inputStyle from "css/main.module.css";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {name, value} = event.target;
        if(name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
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
            console.log(data);
        } catch(error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return (
        <form onSubmit={onSubmit}>
            <input className={inputStyle.authInput} name="email" type="email" placeholder="아이디(이메일)" required value={email} onChange={onChange} />
            <input className={inputStyle.authInput} name="password" type="password" placeholder="비밀번호" required value={password} onChange={onChange} />
            <input type="submit" value={newAccount ? "회원가입" : "로그인"} />
            <p>{error}</p>
            <button type="button" onClick={toggleAccount}>{newAccount ? "이미 계정이 있으신가요?" : "계정이 없다면 지금바로 회원가입"}</button>
        </form>
    );
};

export default AuthForm;