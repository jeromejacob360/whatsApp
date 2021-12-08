import React from 'react';
import { RiCheckDoubleFill } from 'react-icons/ri';
import SingleTick from '../assets/svgs/SingleTick';

export default function MessageStats({ messageIsFromMe, messageObj }) {
  return (
    messageIsFromMe && (
      <div>
        {messageObj.status === 'sent' && (
          <SingleTick className="transform rotate-6" />
        )}
        {messageObj.status === 'delivered' && <RiCheckDoubleFill />}
        {messageObj.status === 'read' && (
          <RiCheckDoubleFill className="text-dodgerblue" />
        )}
      </div>
    )
  );
}