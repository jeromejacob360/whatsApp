import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chatNameGenerator } from '../helpers/formatters';
import sendMessagetoDB from '../helpers/sendMessage';
import { FORWARD_MODE_OFF } from '../store/chatSlice';
import ClickAway from '../hooks/ClickAway';

export default function ContactsPicker({ setOpenContactsPicker }) {
  const [selectedContacts, setSelectedContacts] = useState([]);

  const dispatch = useDispatch();

  const userWAContacts = useSelector(
    (state) => state?.chatState?.userWAContacts,
  );
  const currentUserName = useSelector((state) => state?.authState.user.email);

  const messagesToForward = useSelector(
    (state) => state?.chatState.selectedMessages,
  );

  const currentChatterEmail = useSelector(
    (state) => state?.chatState.currentChatterEmail,
  );

  function addOrRemoveContact(e, contact) {
    e.target.checked
      ? setSelectedContacts([...selectedContacts, contact.email])
      : setSelectedContacts(
          selectedContacts.filter((email) => email !== contact.email),
        );
  }

  async function sendAway() {
    const argsList = [];
    selectedContacts.forEach((contact) => {
      const currentChatName = chatNameGenerator(contact, currentUserName);
      const messages = Object.values(messagesToForward);
      messages.forEach((message) => {
        argsList.push([message, contact, currentUserName, currentChatName]);
      });
    });

    setOpenContactsPicker(false);

    // send messages to each contact one at a time
    for (let i = 0; i < argsList.length; i++) {
      await sendMessagetoDB(...argsList[i]);
    }
  }

  function endForwardMode() {
    setOpenContactsPicker(false);
    dispatch(FORWARD_MODE_OFF());
  }

  return (
    <main className="fixed inset-0 grid w-screen h-screen bg-white bg-opacity-80 place-items-center">
      <ClickAway onClickAway={endForwardMode}>
        <div className="relative flex flex-col p-2 border rounded-md shadow-lg bg-main">
          {userWAContacts?.map((contact) => {
            const contactName = `${contact.firstName} ${contact.surname}`;
            return (
              contact.email !== currentChatterEmail && (
                <label
                  key={contactName}
                  htmlFor={contactName}
                  className="px-3 py-3 cursor-pointer hover:bg-selected"
                >
                  <input
                    value={contact.email}
                    onChange={(e) => addOrRemoveContact(e, contact)}
                    className="mr-3"
                    type="checkbox"
                    name="contactName"
                    id={contactName}
                  />
                  {contactName}
                </label>
              )
            );
          })}
          {selectedContacts.length > 0 && (
            <button
              className="absolute right-0 px-4 py-1 mt-4 border rounded-full shadow-lg -bottom-6 bg-main text-dodgerblue"
              onClick={sendAway}
            >
              SEND
            </button>
          )}
        </div>
      </ClickAway>
    </main>
  );
}