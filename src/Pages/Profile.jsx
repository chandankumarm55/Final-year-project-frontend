import React, { useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { FaArrowLeft } from "react-icons/fa6";
import { host } from '../utils/Constant';

const Profile = () => {
    const { id: userId } = useParams();
    const [selectedImage, setSelectedImage] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");
    const [userData, setUserData] = useState({ fullName: '', email: '', profile: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${host}/user/getProfile/${userId}`);
                setUserData(response.data.user);


                if (response.data.user.profile) {
                    setSelectedImage(`http://localhost:5000/${response.data.user.profile}`);
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
            alert(response.data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload image');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{ error }</div>;
    }

    return (
        <div className="profile-page">
            <div>
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
                    <button className="add-profile-button" onClick={ handleAddProfileClick }>+</button>
                    <input
                        type="file"
                        ref={ fileInputRef }
                        style={ { display: 'none' } }
                        onChange={ handleFileChange }
                    />
                </div>
                <button className="upload-button" onClick={ handleUpload }>Upload</button>
                <div className='user-details'>
                    <h5>Full Name: { userData.fullname }</h5>
                    <h5>Email: { userData.email }</h5>
                </div>
            </div>
        </div>
    );
};

export default Profile;
