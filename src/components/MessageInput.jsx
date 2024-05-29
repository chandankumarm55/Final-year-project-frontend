import React, { useRef, useState } from 'react';
import './styles/MessageInput.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { host } from '../utils/Constant';
import { setMessages } from '../redux/messageSlice';

const MessageInput = () => {

    const { messages } = useSelector(store => store.message)
    const { selectedUser } = useSelector(store => store.user)
    const [message, setMessage] = useState()
    const dispatch = useDispatch()

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true
            const res = await axios.post(`${host}/message/send/${selectedUser?._id}`, { message })
            dispatch(setMessages([...messages, res?.data.newMessage]))


        } catch (error) {
            console.log(error)
        }
        setMessage('')

    }
    return (
        <div className='message-input'>
            <input type='text' placeholder='Type a message...'
                value={ message } onChange={ e => setMessage(e.target.value) }
            />
            <button type='submit' onClick={ onSubmitHandler }>&#10148;</button>
        </div>
    );
};

export default MessageInput;
