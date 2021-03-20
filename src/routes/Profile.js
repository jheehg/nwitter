import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    // displayName은 createUserWithEmailAndPassword로 가입 시 초기값 null

    const onLogOutClick = ()=> {
        authService.signOut();
        history.push("/");
    }
    const getMyNweets = async() => {
        const nweets = await dbService.collection("nweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt")
        .get();
        console.log(nweets.docs.map(doc => doc.data()));
    }

    useEffect(()=> {
        getMyNweets()
    }, []);

    const onSubmit = async (event)=> {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    }

    const onChange = (event) => {
        const { target: {
            value },
        } = event;
        setNewDisplayName(value);
    }

    return (
    <>
    <form onSubmit={onSubmit}>
        <input type="text" placeholder="Display name" 
                value={newDisplayName}
                onChange={onChange}/>
        <input type="submit" value="Update profile" />
    </form>
    <button onClick={onLogOutClick}>Log out</button>
    </>
    );

}