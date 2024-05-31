import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './styles/Sidebar.css';
import ChatList from './ChatList';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TextField } from '@mui/material';
import { host } from '../utils/Constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';
import { IoSearchSharp } from "react-icons/io5";

const Sidebar = () => {
    const dispatch = useDispatch();
    const [searchContact, setSearchContact] = useState('');
    const { authUser } = useSelector(store => store.user);
    const [isPopUpVisible, setIsPopUpVisible] = useState(false);
    const navigate = useNavigate();
    const popupRef = useRef(null);

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${host}/user/logout`);
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    };

    const handlePopUp = () => {
        setIsPopUpVisible(!isPopUpVisible);
    };

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setIsPopUpVisible(false);
        }
    };

    useEffect(() => {
        if (isPopUpVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopUpVisible]);

    return (
        <div className='sidebar'>
            <div className='sidebar-header'>
                <h4>Chatify</h4>
                <div className='profile' onClick={ handlePopUp }>
                    <img
                        src={ authUser?.profilePhoto ? `http://localhost:5000/${authUser?.profilePhoto}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }
                        alt="Avatar"
                        className="avatar"

                    />
                    { isPopUpVisible && (
                        <div className='popup' ref={ popupRef }>
                            <Link to={ `/profile/${authUser?._id}` } className='popup-button'>
                                Profile
                            </Link>
                            <button className='popup-button' onClick={ handleLogout }>Logout</button>
                        </div>
                    ) }
                </div>
            </div>
            <div className='input-container'>
                <IoSearchSharp size={ 20 } />
                <TextField
                    className='input'
                    variant='standard'
                    value={ searchContact }
                    onChange={ (e) => setSearchContact(e.target.value) }
                    placeholder="Search contacts..."
                />
            </div>
            <ChatList searchContact={ searchContact } />
        </div>
    );
};

export default Sidebar;
