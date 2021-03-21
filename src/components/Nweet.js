import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if(ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            if(nweetObj.attachmentUrl != null) {
                await storageService.refFromURL(nweetObj.attachmentUrl).delete();
            }
        }
    }
    const toggleEditing = ()=> setEditing(prev => !prev);
    
    const onChange = (event) => {
        const {target: {value}} = event;
        setNewNweet(value);
    }

    const onSubmit = async(event)=> {
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet,
        });
        toggleEditing();
    }
    return (
        <div>
        {editing?
        <>
            <form onSubmit={onSubmit}>
                <input type="text" onChange={onChange} value={newNweet} placeholder="Edit your nweet" required/>
                <input type="submit" value="Update nweet"/>
                <button onClick={toggleEditing}>Cancel</button>
            </form>
        </>
        :
        <>
            <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl && 
                <img src={nweetObj.attachmentUrl} witdh="50px" height="50px" alt="" />
            }
            {isOwner && 
            <>
                <button onClick={onDeleteClick}>Delete Nweet</button>
                <button onClick={toggleEditing}>Edit Nweet</button>
            </>}
         </>
        }       
        </div>
    );  
}

export default Nweet;