import React, { useState } from "react";
import MessageFormUI from "./MessageFormUI";

const convertToIST = (date) => {
    
    const offset = 5.5 * 60;
    const utcDate = new Date(date);
    const istDate = new Date(utcDate.getTime() + offset * 60 * 1000);
    return istDate.toISOString().replace("T", " ").replace("Z", "+00:00");
};

const StandardMessageForm = ({ props, activeChat }) => {
    const [message, setMessage] = useState("");
    const [attachment, setAttachment] = useState("");

    const handleChange = (e) => setMessage(e.target.value);

    const handleSubmit = async () => {
        const date = convertToIST(new Date());
        const at = attachment
            ? [{ blob: attachment, file: attachment.name }]
            : [];
        const form = {
            attachments: at,
            created: date,
            sender_username: props.username,
            text: message,
            activeChatId: activeChat.id,
        };

        props.onSubmit(form);
        setMessage("");
        setAttachment("");
    };

    return (
        <MessageFormUI
            setAttachment={setAttachment}
            message={message}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
        />
    );
};

export default StandardMessageForm;
