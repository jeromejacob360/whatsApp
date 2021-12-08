import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { BiMenu } from 'react-icons/bi';
import Contacts from '../components/Contacts';
import ClickAway from '../hooks/ClickAway';

export default function Title() {
  const [openContacts, setOpenContacts] = useState(false);

  const currentChatterName = useSelector(
    (state) => state?.chatState.currentChatterName,
  );
  const currentUserAvatar = useSelector(
    (state) => state?.chatState.currentUserAvatar,
  );

  return currentChatterName ? (
    <div className="z-10 flex items-center justify-between h-20 px-4 shadow-md rounded-tl-md sm:rounded-tl-none rounded-tr-md bg-blue-50">
      <div className="flex items-center space-x-2">
        <BiMenu
          size={45}
          className="block sm:hidden"
          onClick={() => setOpenContacts((prev) => !prev)}
        />
        <img
          className="object-cover w-10 h-10 rounded-xl"
          src={currentUserAvatar}
          alt=""
        />
        <motion.h4 layout transition={{ duration: 0.1 }}>
          {currentChatterName}
        </motion.h4>
      </div>
      <div className="flex items-center space-x-4">
        <AiOutlineSearch size={22} />
        <BsThreeDotsVertical size={20} />
      </div>
      <AnimatePresence>
        {openContacts && (
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="absolute bottom-0 left-0 right-0 bg-white md:hidden top-20 rounded-2xl"
          >
            <ClickAway onClickAway={setOpenContacts}>
              <Contacts setOpenContacts={setOpenContacts} />
            </ClickAway>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : null;
}
