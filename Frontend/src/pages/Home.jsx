import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatsContainer from '../components/ChatsContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../context/ChatContext'

const Home = () => {

  const  {selectedUser} = useContext(ChatContext)
  return (
    <div className='w-full h-screen   border sm:px-[15%] sm:py-[5%] '>
      <div className={`grid grid-cols-1 backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden  h-[100%] relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <Sidebar />
        <ChatsContainer />
        <RightSidebar  />

      </div>
    </div>
  )
}

export default Home