import { authService } from "mybase";
import React from "react";
import { signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import AuthForm from "components/AuthForm";
import loginStyle from "css/main.module.css";

const Auth = () => {
    const onSocialClick = async(event) => {
        const {name} = event.target;
        let provider;
        if(name === "google") {
            provider = new GoogleAuthProvider();
        } else if(name === "github"){
            provider = new GithubAuthProvider();
        }
        await signInWithPopup(authService, provider);
    };

    return (
        <div>
            <AuthForm />
            <div>
                <button className={loginStyle.sloginBtn} type="button" name="google" onClick={onSocialClick}>구글 계정으로 로그인</button>
                <button className={loginStyle.sloginBtn} type="button" name="github" onClick={onSocialClick}>깃허브 계정으로 로그인</button>
            </div>
        </div>
    );
};

export default Auth;
