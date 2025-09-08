import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { IoClose } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import axios from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaCheck } from "react-icons/fa";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({ open, setOpen, requests, setRequests, getUsers }) => {


    const getRequests = async () => {
        try {
            const { data } = await axios.get('/api/auth/requests')
            if (data.success) {
                setRequests(data.requests)

            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const response2Request = async (from, response) => {
        try {
            const { data } = await axios.put('/api/auth/response-2-request', { from, status: response })

            if (data.success) {
                toast.success(`عملیات با موفقیت انجام شد`)
                if (response === "Accepted") {
                    getUsers()
                }
                getRequests()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getRequests()
    }, [])

    return (
        <>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                slots={{
                    transition: Transition,
                }}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar className='flex justify-between'>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <IoClose fontSize={35} />
                        </IconButton>
                        <h2 className='text-xl '>
                            درخواست های دوستی
                        </h2>


                    </Toolbar>
                </AppBar>
                <List dir='rtl'>

                    {requests.map((request, idx) => (
                        <>

                            <div
                                key={idx}

                                className='flex justify-between items-center w-full py-2 px-3 sm:px-6 overflow-hidden'>
                                <div className='w-3/4'>
                                    <span className='max-sm:text-sm text-black/70'>یک درخواست دوستی از سمت {request.from.fullName} دارید.</span>

                                </div>
                                <div className='flex items-center gap-1'>
                                    <button
                                        onClick={() => response2Request(request.from._id, "Accepted")}
                                        title='پذیرفتن'
                                        className='cursor-pointer px-3 py-3 rounded bg-green-100 text-green-500'>
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => response2Request(request.from._id, "Rejected")}
                                        title='رد کردن'
                                        className='cursor-pointer px-3 py-3 rounded bg-red-100 text-red-500'>
                                        <IoClose className='scale-150' />
                                    </button>
                                    <button
                                        onClick={() => response2Request(request.from._id, "Blocked")}
                                        title='مسدود کردن'
                                        className='cursor-pointer px-3 py-3 rounded bg-gray-200 text-gray-500'>
                                        <MdBlock />
                                    </button>
                                </div>
                            </div>

                            <Divider />
                        </>
                    ))}





                </List>
            </Dialog>
        </>
    );
}
export default Modal