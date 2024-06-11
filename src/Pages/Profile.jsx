import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { host } from '../utils/Constant';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setOnlineUsers, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import toast from 'react-hot-toast';
import { setMessages } from '../redux/messageSlice';

const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { authUser } = useSelector(store => store.user);
    const { id: userId } = useParams();
    const [selectedImage, setSelectedImage] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");
    const [userData, setUserData] = useState({ fullName: '', email: '', profile: '', bio: '', location: '', username: '' });
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [originalBio, setOriginalBio] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${host}/user/getProfile/${userId}`);
                setUserData(response.data.user);
                setBio(response.data.user.bio || '');
                setOriginalBio(response.data.user.bio || '');

                if (response.data.user.profile) {
                    setSelectedImage(`${host}/${response.data.user.profile}`);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleAddProfileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleUpload = async () => {
        const file = fileInputRef.current.files[0];
        if (!file) {
            alert('Please select an image to upload');
            return;
        }

        const formData = new FormData();
        formData.append('profile', file);

        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${host}/user/uploadProfilePic`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(setAuthUser(response.data.user));
            console.log(response);

            toast.success(response.data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error(error.response.data.message);
        }
    };

    const handleDelete = async () => {

        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${host}/user/deleteaccount`);
            console.log(res)
            if (res.status === 200) {
                toast.success(res.data.message);
                dispatch(setMessages(null))
                dispatch(setAuthUser(null));
                dispatch(setSelectedUser(null));
                dispatch(setOtherUsers(null));
                dispatch(setOnlineUsers(null));
                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };


    const handleBio = async (e) => {
        e.preventDefault();
        if (!bio) {
            return;
        }
        try {
            const res = await axios.post(`${host}/user/setbio`, { bio }, { withCredentials: true });
            toast.success('Bio updated');
            setOriginalBio(bio);
            setUserData(prevData => ({ ...prevData, bio }));
            setEditMode(false);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return <div className='loading'>Loading...</div>;
    }

    if (error) {
        return <div>{ error }</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <Link to='/'><FaArrowLeft /></Link>
                <h2>Profile</h2>
            </div>

            <div className="profile-container">
                <div className="profile-image-wrapper">
                    <img
                        src={ selectedImage }
                        alt="Profile"
                        className="profile-image"
                    />
                    { authUser?._id === userId && (
                        <button className="add-profile-button" onClick={ handleAddProfileClick }>+</button>
                    ) }
                    <input
                        type="file"
                        ref={ fileInputRef }
                        style={ { display: 'none' } }
                        onChange={ handleFileChange }
                    />
                </div>
                { authUser?._id === userId && (
                    <button className="upload-button" onClick={ handleUpload }>Upload</button>
                ) }

                <div className="user-details">
                    <h5>User Name: { userData?.username }</h5>
                    <h5>Full Name: { userData.fullname }</h5>
                    <h5>Email: { userData.email }</h5>
                </div>

                <div className="additional-info">
                    <h6>
                        Bio:
                        { editMode ? (
                            <>
                                <input
                                    type="text"
                                    className="bio-input"
                                    value={ bio }
                                    onChange={ (e) => setBio(e.target.value) }
                                />
                                { bio !== originalBio && (
                                    <button className="submit-button" onClick={ handleBio }>
                                        <FaCheck />
                                    </button>
                                ) }
                            </>
                        ) : (
                            <span>{ userData.bio || 'Hey im using Chatify' }</span>
                        ) }
                        { authUser?._id === userId && !editMode && (
                            <button className="edit-button" onClick={ () => setEditMode(true) }>
                                <FaEdit size={ 15 } />
                            </button>
                        ) }
                    </h6>
                    <div className='delete'>
                        {
                            authUser?._id === userId ? (
                                <button onClick={ handleDelete }>Delete Account</button>
                            ) : (
                                <div> </div>
                            )
                        }

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
