import { authService, fireBaseInstance } from "fbase";
import React, { useState } from "react";

 const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if(newAccount) {
                // create account
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                // login
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data);
        } catch(error) {
            setError(error.message);
        }
    };
    const toggleAccount = ()=> setNewAccount((prev) => !prev);
    const onSocialClick = async (event)=> {
        const {
            target: { name },
        } = event;
        let provider;
        if(name === "google") {
            provider = new fireBaseInstance.auth.GoogleAuthProvider();
        } else if (name === "github") {
            provider = new fireBaseInstance.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);
    };

    return (
 <div>
    <form onSubmit={onSubmit}>
        <input 
            name="email" 
            type="test" 
            placeholder="Email" 
            required 
            value={email}
            onChange={onChange}
            />
        <input 
            name="password" 
            type="password" 
            placeholder="password" 
            required 
            value={password}
            onChange={onChange}
            />
        <input name="login"  type="submit" 
            value={newAccount? "Create Account" : "Sign In" }/>
        {error}
        <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account" }</span>
    </form>
    <div>
        <button name="google" onClick={onSocialClick}>Continue with Google</button >
        <button name="github" onClick={onSocialClick}> Continue with Github</button >
    </div>
</div>
)
}; 

export default Auth;