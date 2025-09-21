import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
const MediaProgressbar = ({isMediaUploading, mediaUploadProgress}) => {
    const[showProgressBar, setShowProgressBar] = useState(false);
    const[animatedProgressBar, setAnimatedProgressBar] = useState(0);
    useEffect(()=>{
        if(isMediaUploading){
            setShowProgressBar(true);
            setAnimatedProgressBar(mediaUploadProgress);
        } else{
            const timer = setTimeout(() => {
                setShowProgressBar(false);
                setAnimatedProgressBar(0);
                
            },1000)
            return () => clearTimeout(timer);
        }
        
    },[isMediaUploading, mediaUploadProgress])
    if(!showProgressBar){
        return null;
    }
  return (
    <div className='w-full bg-gray-200 rounded-full h-3 mb-4 relative overflow-hidden '>
       <motion.div className='bg-blue-500 h-3 rounded-full '
       initial={{width: 0}} 
       animate={{ width: `${animatedProgressBar}%` }}
    transition={{ duration: 0.5, ease: "easeInOut" }}

       >
        {
            mediaUploadProgress >= 100 && isMediaUploading &&(
                <motion.div
                className='absolute top-0 left-0 right-0 bottom-0 bg-blue-300 opacity-50'
                animate={{
                    x:['0%', '100%', '0%'],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"

                }}
                >
                    
                </motion.div>
            )
        }
       </motion.div> 

    </div>
  )
}

export default MediaProgressbar