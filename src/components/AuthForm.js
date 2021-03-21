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
        <form onSubmit={onSubmit} className="container">
        <input 
            name="email" 
            type="test" 
            placeholder="Email" 
            required 
            value={email}
            onChange={onChange}
            className="authInput"
            />
        <input 
            name="password" 
            type="password" 
            placeholder="password" 
            required 
            value={password}
            onChange={onChange}
            className="authInput"
            />
        <input name="login"  type="submit" className="authInput authSubmit"
            value={newAccount? "Create Account" : "Sign In" }/>
        {error && <span className="authError">{error}</span>}
        <span onClick={toggleAccount} className="authSwitch">
            {newAccount ? "Sign In" : "Create Account" }
        </span>
    </form>
    );

}

export default AuthForm;