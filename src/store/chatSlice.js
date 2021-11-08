import { createSlice } from '@reduxjs/toolkit';
import { chatNameGenerator } from '../helpers/formatters';

const initialState = {
  chats: {},
  currentChatName: '',
  userContacts: '',
  currentChatterEmail: '',
  chatNames: '',
  userWAContacts: '',
  messageToReply: '',
  focusInput: false,
  namelessChats: [],
};

export const chatSlice = createSlice({
  name: 'CHATSLICE',
  initialState,
  reducers: {
    SET_USER_CONTACTS: (state, action) => {
      state.userContacts = action.payload;
    },

    UPDATE_USER_CONTACTS: (state, action) => {
      state.userContacts = state.userContacts.map((contact) =>
        contact.email === action.payload.email ? action.payload : contact,
      );
    },

    REMOVE_USER_CONTACT: (state, action) => {
      console.log('REMOVE USER CONTACT');
      const { deletedContact, currentUserEmail } = action.payload;

      state.userContacts = state.userContacts.filter(
        (contact) => contact.email !== deletedContact.email,
      );
      state.userWAContacts = state.userWAContacts.filter(
        (contact) => contact.email !== deletedContact.email,
      );
      const chatName = chatNameGenerator(
        currentUserEmail,
        deletedContact.email,
      );
      if (chatName === state.currentChatName) {
        state.currentChatName = '';
      }
    },

    SET_USERS_WA_CONTACTS: (state, action) => {
      state.userWAContacts = action.payload;
    },

    SET_CURRENT_CHAT: (state, action) => {
      const { currentUserEmail, currentChatterEmail, contactName } =
        action.payload;
      const currentChatName = chatNameGenerator(
        currentUserEmail,
        currentChatterEmail,
      );
      state.currentChatName = currentChatName;
      state.currentChatterEmail = currentChatterEmail;
      state.currentChatterName = contactName;
    },

    CLEAR_CURRENT_CHAT: (state) => {
      state.currentChatName = '';
    },

    ADD_CHATNAMES: (state, action) => {
      state.chatNames = action.payload;
    },

    NAMELESS_CHAT: (state, action) => {
      state.namelessChats.push(action.payload);
    },

    REMOVE_NAMELESS_CHAT: (state, action) => {
      const chatName = action.payload;
      const namelessChats = state.namelessChats;

      const index = namelessChats.indexOf(chatName);
      if (index > -1) {
        namelessChats.splice(index, 1);
      }

      state.namelessChats = namelessChats;
    },

    //manage messaging

    ADD_MESSAGE: (state, action) => {
      const { chatName, message } = action.payload;
      state.chats[chatName]
        ? state.chats[chatName].push(message)
        : (state.chats[chatName] = [message]);
    },

    DELETE_MESSAGE: (state, action) => {
      const { chatName, message } = action.payload;
      state.chats[chatName] = state.chats[chatName].map((chat) =>
        chat.time === message.time ? message : chat,
      );
    },

    REPLY: (state, action) => {
      const { message: messageObject, currentChatName } = action.payload;
      const messageText = messageObject.message;

      const trimmedMessage =
        messageText.length > 20
          ? messageText.substring(0, 20) + '...'
          : messageText;

      const messageToReply = { ...messageObject, message: trimmedMessage };

      state.messageToReply = {
        ...state.messageToReply,
        [currentChatName]: messageToReply,
      };
      state.focusInput = true;
    },

    CLEAR_REPLY_MESSAGE: (state, action) => {
      const currentChatName = action.payload;
      state.messageToReply[currentChatName] = ''; //TODO remote the key from the object
      state.focusInput = false;
    },

    CLEAR_STATE: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function

export const {
  SET_USER_CONTACTS,
  SET_CURRENT_CHAT,
  CLEAR_CURRENT_CHAT,
  ADD_CHATNAMES,
  CLEAR_STATE,
  SET_USERS_WA_CONTACTS,
  ADD_MESSAGE,
  CHAT_HISTORY_REF,
  DELETE_MESSAGE,
  REPLY,
  CLEAR_REPLY_MESSAGE,
  NAMELESS_CHAT,
  REMOVE_NAMELESS_CHAT,
  REMOVE_USER_CONTACT,
  UPDATE_USER_CONTACTS,
} = chatSlice.actions;

export default chatSlice.reducer;
