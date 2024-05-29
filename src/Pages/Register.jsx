import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import './Register.css';
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { host } from '../utils/Constant';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const validation = (e) => {
        e.preventDefault();


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            email.trim() === '' ||
            username.trim() === '' ||
            password.trim() === '' ||
            confirmPassword.trim() === '' ||
            fullname.trim() === ''
        ) {
            toast.error('All fields are required');
            return false;
        }
        if (!emailRegex.test(email)) {
            toast.error('Invalid email format');
            return false;
        }
        if (password !== confirmPassword) {
            toast.error('Password and confirm password should be same');
            return false;
        }
        if (username.length < 3) {
            toast.error('Username should be at least 3 characters');
            return false;
        }
        if (password.length < 6) {
            toast.error('Password should be at least 3 characters');
            return false;
        }
        return true;
    };


    const sendDataToBackend = async (e) => {
        try {
            if (!validation(e)) {
                return;
            }
            const response = await axios.post(`${host}/user/register`, {
                email, username, password, fullname
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }, withCredentials: true
            });
            console.log(response);
            if (response) {
                toast.success(response.data.message);
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error);
        }
    };

    return (
        <div className='register-container'>
            <div className='info'>
                <p style={ { fontSize: '35px', fontWeight: 'bold' } }>Welcome to Chatify</p>
            </div>
            <div className='form'>
                <form onSubmit={ sendDataToBackend }>
                    <Box className='header' > <BiSolidMessageRoundedDots size={ 35 } /><h1>Chatify</h1></Box>
                    <TextField id="standard-basic" label="Fullname" variant="standard"
                        value={ fullname } onChange={ e => setFullname(e.target.value) }
                    />

                    <TextField id="standard-basic" label="Email" variant="standard"
                        value={ email } onChange={ e => setEmail(e.target.value) }
                    />

                    <TextField id="standard-basic" label="UserName" variant="standard"
                        value={ username } onChange={ e => setUsername(e.target.value) }
                    />

                    <TextField id="standard-basic" label="Password" variant="standard" type='password'
                        value={ password } onChange={ e => setPassword(e.target.value) }
                    />

                    <TextField id="standard-basic" label="ConfirmPassword" variant="standard" type='pasword'
                        value={ confirmPassword } onChange={ e => setConfirmPassword(e.target.value) }
                    />

                    <Button variant="contained" type="submit">Sing-Up</Button>
                    <Box style={ { textAlign: 'center' } }>Or</Box>
                    <Box style={ { width: '100%' } }>
                        <Link to='/login'>
                            <Button variant="contained" color="success" style={ { width: '100%' } }>
                                Sing-In
                            </Button>
                        </Link>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default Register;
