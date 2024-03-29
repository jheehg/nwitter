import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";


const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if(ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            if(nweetObj.attachmentUrl !== null && nweetObj.attachmentUrl !== '') { 
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
        <div className="nweet">
        {editing?
        <>
            <form onSubmit={onSubmit} className="container nweetEdit">
                <input 
                    type="text" 
                    onChange={onChange} 
                    value={newNweet} 
                    placeholder="Edit your nweet" 
                    autoFocus
                    className="formInput"
                    required/>
                <input type="submit" value="Update Nweet" className="formBtn" />
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                    Cancel
                </span>           
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
            <div class="nweet__actions">
                <span onClick={onDeleteClick}>
                    <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                     <FontAwesomeIcon icon={faPencilAlt} />
                </span>
            </div>
            </>}
         </>
        }       
        </div>
    );  
}

export default Nweet;