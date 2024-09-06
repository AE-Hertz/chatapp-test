import {
    PaperAirplaneIcon,
    PaperClipIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import Dropzone from "react-dropzone";

const MessageFormUI = ({
    setAttachment,
    message,
    handleChange,
    handleSubmit,
    appendText,
    handleKeyDown,
}) => {
    const [preview, setPreview] = useState("");

    const customHandleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setPreview(""); 
            handleSubmit();
        } else if (event.key === "Tab") {
            event.preventDefault();
            handleKeyDown(event); 
        }
    };

    return (
        <div className="message-form-container">
            {preview && (
                <div className="message-form-preview">
                    <img
                        alt="message-form-preview"
                        className="message-form-preview-image"
                        src={preview}
                        onLoad={() => URL.revokeObjectURL(preview)}
                    />
                    <XMarkIcon
                        className="message-form-icon-x"
                        onClick={() => {
                            setPreview("");
                            setAttachment("");
                        }}
                    />
                </div>
            )}
            <div className="message-form">
                <div className="message-form-input-container">
                    <input
                        className="message-form-input"
                        type="text"
                        value={message}
                        onChange={handleChange}
                        onKeyDown={customHandleKeyDown}
                        placeholder="Send a message..."
                    />
                    {appendText && (
                        <input
                            className="message-form-assist"
                            type="text"
                            disabled="disabled"
                            value={`${message} ${appendText}`}
                        />
                    )}
                </div>
                <div className="message-form-icons">
                    <Dropzone
                        acceptedFiles=".jpeg,.jpg,.png"
                        multiple={false}
                        noClick={true}
                        onDrop={(acceptedFiles) => {
                            setAttachment(acceptedFiles[0]);
                            setPreview(URL.createObjectURL(acceptedFiles[0]));
                        }}
                    >
                        {({ getRootProps, getInputProps, open }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <PaperClipIcon
                                    className="message-form-icon-clip"
                                    onClick={open}
                                />
                            </div>
                        )}
                    </Dropzone>
                    <hr className="vertical-line" />
                    <PaperAirplaneIcon
                        className="message-form-icon-airplane"
                        onClick={() => {
                            setPreview("");
                            handleSubmit();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MessageFormUI;
