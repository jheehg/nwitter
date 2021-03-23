import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Nweet from "components/Nweet";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    // displayName은 createUserWithEmailAndPassword로 가입 시 초기값 null
    const [myNweets, setMyNweets] = useState([]);

    const onLogOutClick = ()=> {
        authService.signOut();
        history.push("/");
    }
    const getMyNweets = async () => {
         await dbService.collection("nweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt", "desc")
        .onSnapshot(snapshot => {
            const myNweetArray = snapshot.docs.map((doc) =>
             ({ id: doc.id,
                ...doc.data()})
            )
            setMyNweets(myNweetArray);
        });
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
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    onChange={onChange}
                    type="text"
                    autoFocus
                    placeholder="Display name"
                    value={newDisplayName}
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                    marginTop: 10,
                    }} />
            </form>
            <div style={{ marginTop: 30 }}>
                {myNweets.map((nweetData) => 
                 <Nweet key={nweetData.id} 
                        nweetObj={nweetData} 
                        isOwner={nweetData.creatorId === userObj.uid } />)}
            </div>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );

}