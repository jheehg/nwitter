import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFacotry = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        if(nweet === "") return;
        let attachmentUrl = "";
        if(attachment !== "" && attachment !== null) {
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
        if(theFile) {
            reader.onloadend = (finishedEvent) => {
                const {
                    currentTarget: { result }, 
                } = finishedEvent;
                setAttachment(result); 
            }
            reader.readAsDataURL(theFile);
        }
    }
    const onClearPhotoClick = () => setAttachment("");
    
    return (
        <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
           <input
                className="factoryInput__input"
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
            />
            <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
        <label for="attach-file" className="factoryInput__label">
            <span>Add photos</span>
            <FontAwesomeIcon icon={faPlus} />
        </label>
        <input id="attach-file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ opacity: 0, }}
        />
        {attachment &&
            (<div className="factoryForm__attachment">
                <img
                    src={attachment}
                    style={{ backgroundImage: attachment, }}
                />
                <div className="factoryForm__clear" onClick={onClearPhotoClick}>
                    <span>Remove</span>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
            </div>)}
        </form>
    );
}

export default NweetFacotry;