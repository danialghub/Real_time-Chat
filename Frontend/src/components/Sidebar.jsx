import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import Badge from '@mui/material/Badge'
import { IoMdMail } from "react-icons/io";
import { MdPersonSearch } from "react-icons/md";
import RequestsModal from './RequestsModal'
import FriendRequest from './FriendRequest'


const Sidebar = () => {

    const navigate = useNavigate()
    const { getUsers, users, selectedUser, setSelectedUser, setUnseenMessages, unseenMessages } = useContext(ChatContext)
    const { logout, onlineUser } = useContext(AuthContext)
    const [input, setInput] = useState('')
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState([])

    const [seachFriend, setSeachFriend] = useState(false);
    const filteredUsers = input ? users.filter(user => user.fullName.toLowerCase().includes(input.toLowerCase())) : users


    useEffect(() => {
        getUsers()
    }, [onlineUser])

    return (
        <div className={`bg-[#8185B2]/10 h-full p-3 py-5 rounded-r-xl  text-white ${selectedUser ? "max-md:hidden" : ""} `}>
            {/* shows all requests */}
            <RequestsModal open={open} setOpen={setOpen} requests={requests} setRequests={setRequests} getUsers={getUsers} />
            <FriendRequest open={seachFriend} setOpen={setSeachFriend} />
            <div className='pb-5'>
                <div className='flex justify-between items-center'>
                    <img src={assets.logo} alt="logo" className='max-w-40' />
                    <div className='flex items-center gap-5 sm:gap-3 max-sm:pr-3'>

                        <MdPersonSearch
                            className='cursor-pointer'
                            fontSize={23}
                            onClick={() => setSeachFriend(true)}
                        />
                        <Badge
                            title="تمام درخواست ها"
                            className='cursor-pointer'
                            onClick={() => setOpen(true)}
                            color="primary"
                            badgeContent={requests.length}>
                            <IoMdMail fontSize={20} />
                        </Badge>

                        <div className='relative py-2 group ' tabIndex={0}>
                            <img src={assets.menu_icon} alt="Menu" className='max-h-4 cursor-pointer' />
                            <div className='absolute top-8 right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block group-focus:block'>
                                <p
                                    onClick={() => navigate('/profile')}
                                    className='cursor-pointer text-sm'>Edit Profile</p>
                                <hr className='my-2 border-t border-gray-500' />
                                <p onClick={logout} className='cursor-pointer text-sm'>Logout</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                    <img src={assets.search_icon} alt="Search" className='w-3' />
                    <input
                        onChange={e => setInput(e.target.value)}
                        value={input}
                        type="text"
                        className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
                        placeholder='Search User...' />
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto max-h-[100%]">
                {filteredUsers.map((user, idx) => (
                    <div
                        onClick={() => {
                            setSelectedUser(user); setUnseenMessages(prev =>
                                ({ ...prev, [user._id]: 0 }))
                        }}
                        key={idx}
                        className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && "bg-[#282142]/50"}`}>
                        <img src={user?.profilePic || assets.avatar_icon} alt="profile"
                            className='w-[35px] aspect-[1/1] rounded-full ' />
                        <div>
                            <p>{user.fullName}</p>
                            {onlineUser.includes(user._id)
                                ? <span className='text-xs text-green-400'>Online</span>
                                : <span className='text-xs text-neutral-400'>Offline</span>

                            }
                        </div>
                        {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-0 text-xs h-6 w-6 flex justify-center items-center rounded-full bg-violet-500/50 '>{unseenMessages[user._id]}</p>}


                    </div>
                ))

                }
            </div>
        </div>
    )
}

export default Sidebar