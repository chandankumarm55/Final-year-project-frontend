import React, { useEffect } from 'react';
import axios from 'axios';
import { host } from '../utils/Constant';
import { useDispatch } from 'react-redux'
import { setOtherUsers } from '../redux/userSlice';
const useGetOtheruser = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchOtherUser = async () => {
            try {
                const res = await axios.get(`${host}/user`, {
                    withCredentials: true
                });
                dispatch(setOtherUsers(res.data))

            } catch (error) {
                console.log(error);
            }
        };
        fetchOtherUser();
    }, []);

    return null;
};

export default useGetOtheruser;
