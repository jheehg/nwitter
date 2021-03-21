import React, { useState, useEffect } from "react";
import NweetFactory from "components/NweetFactory";
import Nweet from "components/Nweet";
import { dbService } from "fbase";


const Home = ({userObj}) => {
    const [nweets, setNweets] = useState([]);

    useEffect(()=>{
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map((doc) =>
             ({ id: doc.id,
                ...doc.data()})
            )
            setNweets(nweetArray);
        });
    }, []);

    return (
    <div>
       <NweetFactory userObj={userObj}/>
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