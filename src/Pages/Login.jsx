import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import './Login.css';
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';
import { host } from '../utils/Constant';

const Login = () => {
    const dispatch = useDispatch()
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const validation = async () => {

        if (usernameOrEmail.trim() === '' || password.trim() === '') {
            toast.error('All fields are required');
            return false;
        }

        if (usernameOrEmail.length < 3) {
            toast.error('Username should be at least 3 characters');
            return false;
        }
        return true;
    };

    const sendDataToBackend = async (e) => {
        e.preventDefault();
        try {
            const isValid = await validation();
            if (isValid) {
                const response = await axios.post(`${host}/user/login`, {
                    usernameOrEmail, password
                }, {
                    withCredentials: true
                });
                console.log(response);
                if (response) {
                    toast.success(response.data.message);
                    dispatch(setAuthUser(response.data))
                    navigate('/');
                }
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error);
        }
    };


    return (
        <div className='login-container'>
            <div className='info'>
                <p>Chatify is a messaging app facilitating seamless communication, offering features like real-time messaging, multimedia sharing, and customizable chat settings for personalized user experiences.</p>
            </div>
            <div className='form'>
                <form className='login-form' >
                    <Box className='header'> <BiSolidMessageRoundedDots size={ 35 } /><h1>Chatify</h1></Box>
                    <TextField id="usernameOrEmail" label="Username or Email" variant="standard"
                        value={ usernameOrEmail } onChange={ e => setUsernameOrEmail(e.target.value) }
                    />

                    <TextField id="password" label="Password" variant="standard" type="password"
                        value={ password } onChange={ e => setPassword(e.target.value) }
                    />
                    <Button variant="contained" type="submit" onClick={ sendDataToBackend }>Sign-In</Button>
                    <Box style={ { textAlign: 'center' } }>Or</Box>

                    <Box style={ { width: '100%' } }>
                        <Link to='/register'>
                            <Button variant="contained" color="success" style={ { width: '100%' } }>
                                Sign-Up
                            </Button>
                        </Link>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default Login;
