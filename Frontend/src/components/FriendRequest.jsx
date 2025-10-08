import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { IoPersonAddSharp, IoClose } from "react-icons/io5";

import assets from '../assets/assets'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'
export default function FriendRequest({ open, setOpen }) {

    const [input, setInput] = useState('')
    const [searchedUsers, setSearchedUsers] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { axios } = useContext(AuthContext)
    const handleClose = () => {
        setSearchedUsers(false)
        setError('')
        setInput('')
        setOpen(false);
    };

    const sendRequest = async (id) => {

        try {
            const { data } = await axios.post('/api/auth/send-request', { to: id })

            if (data.success) {
                toast.success('درخواست با موفقیت داده شده')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const searchUsersHandler = async (e) => {
        setSearchedUsers(false)
        setError('')
        e.preventDefault();
        try {
            setLoading(true)
            if (input) {
                const { data } = await axios.get(`/api/auth/search-user/${input}`)
                if (data.success) {
                    setSearchedUsers(data.users)
                } else {
                    setError(data.message)
                    setSearchedUsers([])
                }
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }

    }

    return (
        <>

            <Dialog open={open} onClose={handleClose} >

                <DialogContent className='bg-slate-900  relative overflow-hidden '>
                    <button
                        onClick={handleClose}
                        className='absolute top-2 right-2 cursor-pointer'>
                        <IoClose fontSize={30} color='#fff' />
                    </button>
                    {/* search user */}

                    <form
                        className='bg-[#282142] rounded-full  relative py-2 px-4 mt-8'
                        onSubmit={searchUsersHandler}>
                        <input
                            onChange={e => setInput(e.target.value)}
                            value={input}
                            type="text"
                            className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1 w-64'
                            placeholder='Search User...' />
                        <button
                            type='submit'
                            className='size-9  bg-indigo-600 absolute right-0 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer'>
                            <img src={assets.search_icon} alt="Search" className='w-4  ' />
                        </button>

                    </form>

                    {/* map All users with their name */}
                    {!loading ?
                        searchedUsers ? searchedUsers.length ?
                            <div dir='rtl' className='mt-10 h-[50vh] overflow-y-auto w-full'>
                                {
                                    searchedUsers.map((user, idx) => (

                                        <div
                                            key={idx}
                                            className='duration-150 rounded ease-in-out cursor-pointer hover:bg-slate-800/30 flex items-center justify-between'>
                                            <div className='p-2 flex items-center gap-3 text-white'>

                                                <img src={user.profilePic || assets.avatar_icon} className='w-10 rounded-full' alt="" />
                                                <span>{user.fullName}</span>
                                            </div>

                                            <button
                                                onClick={() => sendRequest(user._id)}
                                                title='درخواست دوستی'
                                                className='px-2 py-2 max-md:text-sm cursor-pointer  bg-purple-700/60 rounded text-white'>
                                                <IoPersonAddSharp fontSize={20} />
                                            </button>

                                        </div>
                                    ))}
                            </div>
                            : <div className='h-[50vh] flex items-center justify-center text-xl text-white'>{error}</div>
:<div className=' text-md text-white py-10'>
    نام دوست خود را  جهت درخواست جستجو کنید
</div>
                        : <div className='h-[50vh] flex items-center justify-center text-xl text-white'>Loading...</div>
                    }
                </DialogContent>

            </Dialog>
        </>
    );
}
