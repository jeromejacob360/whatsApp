import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@firebase/firestore';
import { db } from '../../firebase/firebase';
import ClickAway from '../../hooks/ClickAway';
import {
  ADD_MESSAGE_TO_FORWARDS,
  FORWARD_MODE_ON,
  REPLY,
} from '../../store/chatSlice';

export default function ChatOptions({ message, setOpenOptions, setSelected }) {
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName,
  );

  const dispatch = useDispatch();

  const currentUserName = useSelector((state) => state?.authState?.user?.email);

  const messageIsFromMe = message?.from === currentUserName;

  async function reply() {
    dispatch(REPLY({ message, currentChatName }));
  }

  function forwardMessage() {
    setSelected(true);
    dispatch(FORWARD_MODE_ON());
    dispatch(ADD_MESSAGE_TO_FORWARDS(message));
  }

  async function deleteForMe() {
    const docRef = doc(
      db,
      'whatsApp/chats',
      currentChatName,
      message.time.toString(),
    );

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(
        docRef,
        { deletedForMe: arrayUnion(currentUserName) },
        { merge: true },
      );
    } else {
      console.log('No such document!');
    }
  }

  async function deleteForEveryone() {
    const docRef = doc(
      db,
      'whatsApp/chats',
      currentChatName,
      message.time.toString(),
    );

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, {
        ...message,
        deleted: true,
        message: 'This message was deleted',
        mediaUrl: '',
      });
    } else {
      console.log('No such document!');
    }
  }

  return (
    <ClickAway onClickAway={() => setOpenOptions(false)}>
      <motion.div
        initial={{ width: 0, height: 0 }}
        animate={{ width: 'auto', height: 'auto' }}
        exit={{ width: 0, height: 0 }}
        className={`z-10 absolute bg-white rounded-md shadow-md right-4 top-5 overflow-hidden`}
      >
        <ul className="w-40 py-3 space-y-3 text-sm text-icons">
          <li className="w-full cursor-pointer hover:bg-dim">
            <div className="py-1 pl-6">Message info</div>
          </li>
          <li onClick={reply} className="w-full cursor-pointer hover:bg-dim">
            <div className="py-1 pl-6">Reply</div>
          </li>
          <li
            onClick={forwardMessage}
            className="w-full cursor-pointer hover:bg-dim"
          >
            <div className="py-1 pl-6">Forward message</div>
          </li>
          <li className="w-full cursor-pointer hover:bg-dim">
            <div className="py-1 pl-6">Star message</div>
          </li>
          <li
            onClick={deleteForMe}
            className="w-full cursor-pointer hover:bg-dim"
          >
            <div className="py-1 pl-6">Delete for me</div>
          </li>
          {messageIsFromMe && (
            <li
              onClick={deleteForEveryone}
              className="w-full cursor-pointer hover:bg-dim"
            >
              <div className="py-1 pl-6">Delete for everyone</div>
            </li>
          )}
        </ul>
      </motion.div>
    </ClickAway>
  );
}
