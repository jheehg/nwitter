import React, { useState } from "react";
import { authService } from "fbase";

const AuthForm = () => {
    const [newAccount, setNewAccount] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    };
   
    const toggleAccount = ()=> setNewAccount((prev) => !prev);

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

    return (
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
    );

}

export default AuthForm;