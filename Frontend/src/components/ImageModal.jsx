import React from 'react'
import { ImCross } from "react-icons/im";
const ImageModal = ({ imageUrl, setIsShowModal }) => {
    return (
        <div className='bg-black/90 w-full  h-full   absolute top-0 left-0  backdrop-blur-2xl z-10 p-10 flex items-center justify-center '>
            <ImCross
                color='white'
                onClick={() => setIsShowModal(false)}
                className='absolute top-8 right-8 z-20 text-xl cursor-pointer' />
            <div >
                <img src={imageUrl} alt="" className=' rounded-lg' />
            </div>
        </div>
    )
}

export default ImageModal