import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    useEffect(()=>{
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map((doc) =>
             ({ id: doc.id,
                ...doc.data()})
            )
            setNweets(nweetArray);
        });
    }, []);
    
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const nweetCol = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("nweets").add(nweetCol);
        setNweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        const {target: {value}} = event;
        setNweet(value);
    };
    console.log(userObj);

    const onFileChange = (event) => {
        const { 
            target: {files, }
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result }, 
            } = finishedEvent;
            setAttachment(result); 
        }
        reader.readAsDataURL(theFile);

    }
    const onClearPhotoClick = () => setAttachment(null);

    return (
    <div>
        <form onSubmit={onSubmit}> 
            <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength="20" />
            <input type="file" accept="image/*" onChange={onFileChange}/>
            <input type="submit" value="Nweet" />
            {attachment &&
            <>
                <img src={attachment} width="50px" height="50px" alt=""/>
                <button onClick={onClearPhotoClick}>Clear</button>
            </>
            }
        </form>
        <div>
            {nweets.map((nweetData) => 
                <Nweet 
                    key={nweetData.id} 
                    nweetObj={nweetData} 
                    isOwner={nweetData.creatorId === userObj.uid }
                />)}
        </div>
    </div>
    )
}

export default Home;