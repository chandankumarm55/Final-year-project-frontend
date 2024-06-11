import React, { useRef, useState, useEffect } from 'react';
import './styles/MessageInput.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { host } from '../utils/Constant';
import { setMessages } from '../redux/messageSlice';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = () => {
    const { messages } = useSelector((store) => store.message);
    const { selectedUser, authUser } = useSelector((store) => store.user);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const dispatch = useDispatch();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${host}/message/send/${selectedUser?._id}`, { message });
            dispatch(setMessages([...messages, res?.data.newMessage]));
        } catch (error) {
            console.log(error);
        }
        setMessage('');
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    const handleOutsideClick = (e) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
            setShowEmojiPicker(false);
        }
    };

    useEffect(() => {
        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showEmojiPicker]);

    // Check if either user has blocked the other
    const isBlocked = authUser?.blockedUsers?.includes(selectedUser?._id) || selectedUser?.blockedUsers?.includes(authUser?._id);

    return (
        <>
            { isBlocked ? (
                <div className="blocked-message">
                    { authUser?.blockedUsers?.includes(selectedUser?._id)
                        ? 'You have blocked this user.'
                        : `${selectedUser?.fullname} has blocked you.` }
                </div>
            ) : (
                <div className="message-input">
                    <button onClick={ () => setShowEmojiPicker(!showEmojiPicker) } className='emoji'>&#128512;</button>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={ message }
                        onChange={ (e) => setMessage(e.target.value) }
                    />
                    <button type="submit" onClick={ onSubmitHandler } className='submit'>
                        &#10148;
                    </button>
                    { showEmojiPicker && (
                        <div className="emoji-picker-container" ref={ emojiPickerRef }>
                            <EmojiPicker
                                onEmojiClick={ handleEmojiClick }
                                searchDisabled={ true }
                                previewConfig={ {
                                    showPreview: false,
                                } }
                            />
                        </div>
                    ) }
                </div>
            ) }
        </>
    );
};

export default MessageInput;
