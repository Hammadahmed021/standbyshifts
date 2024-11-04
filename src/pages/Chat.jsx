import React, { useState, useEffect, useRef } from "react";
// import { db, auth } from '/firebase';
import {
  collection,
  doc,
  query,
  orderBy,
  updateDoc,
  onSnapshot,
  where,
  setDoc,
  getDoc,
  serverTimestamp,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../service/firebase";
import { verifyUser } from "../utils/Api";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


function Chat() {
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedUser, setSelectedUser] = useState(location.state);
  const [authUser, setAuthUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatroomId, setChatroomId] = useState("");
  const [lastMessages, setLastMessages] = useState({});
  const chatroomDocRef = useRef(null);

  console.log(selectedUser, 'selectedUser ???');
  

  const userData = useSelector((state) => state.auth.userData);
  

  const getUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      return null;
    }
  };

  useEffect(() => {
    getAuth();
    selectUser(location.state);
  }, []);

  const getAuth = async () => {
    const userAgent = navigator.userAgent;
    const ipAddress = await getUserIP();

    const payload = {
      userAgent,
      ipAddress,
    };
    const response = await verifyUser(payload);
    const data = await response.data;
    setAuthUser(data);
  };

  const sortUsersByLastMessage = () => {
    setUsers((prevUsers) => [
      ...prevUsers.sort((a, b) => {
        const dateA = a.lastMessage?.createdAt?.toDate() || 0;
        const dateB = b.lastMessage?.createdAt?.toDate() || 0;
        return dateB - dateA;
      }),
    ]);
  };

  const getChatRoomObj = async (newChatroomId) => {
    return doc(db, "messages", `${newChatroomId}`);
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    setIsSelected(true);

    const newChatroomId =
      userData?.user?.id < user?.id
        ? `${user?.applied_jobs?.id}_${userData?.user?.id}_${user?.id}`
        : `${user?.applied_jobs?.id}_${user?.id}_${userData?.user?.id}`;
    setChatroomId(newChatroomId);

    chatroomDocRef.current = await getChatRoomObj(newChatroomId);

    const chatroomDocSnap = await getDoc(chatroomDocRef.current);

    if (!chatroomDocSnap.exists()) {
      await setDoc(chatroomDocRef.current, { messages: [] });
    }

    const lastMessageQuery = query(
      collection(db, "messages", newChatroomId, "messages"),
      where("sender", "==", user.id),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(lastMessageQuery);
    if (!querySnapshot.empty) {
      const lastMessageDoc = querySnapshot.docs[0];
      const messageRef = doc(
        db,
        "messages",
        newChatroomId,
        "messages",
        lastMessageDoc.id
      );
      await updateDoc(messageRef, { seen: "1" });
    }

    const messagesQuery = query(
      collection(chatroomDocRef.current, "messages"),
      orderBy("createdAt")
    );
    onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const chatMessagesCollection = collection(
          chatroomDocRef.current,
          "messages"
        );
        await setDoc(doc(chatMessagesCollection), {
          text: newMessage,
          sender: userData.user?.id,
          receiver: selectedUser.id,
          user: userData.user?.name,
          seen: 0,
          createdAt: serverTimestamp(),
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error adding message:", error);
      }
    }
  };

  return (
    <div className="container max-h-screen h-[75vh] mb-6 relative">
    <div className="w-full max-w-md lg:max-w-lg mx-auto bg-white shadow-lg rounded-lg flex flex-col h-full">
      {/* Chat Header */}
      <div className="text-start text-base flex justify-between gap-1 py-3 border-b border-gray-200 rounded-t-lg bg-gray-100 px-2 capitalize">
       <span> <span className="font-semibold">Chatting with - </span> {selectedUser?.name || "Chat Room"}</span>
       <span> <span className="font-semibold">Job title - </span> {selectedUser?.applied_jobs?.title || "N/A"}</span>
      </div>

      {/* Messages Container */}
      <section className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`flex ${
                message.sender === userData?.user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`flex flex-col ${message.sender === userData?.user.id ? 'items-end' : 'items-start' } max-w-xs lg:max-w-sm`}>
                <div
                  className={`px-2 py-2 rounded-lg text-sm shadow-sm ${
                    message.sender === userData?.user.id
                      ? "bg-blue-500 text-white text-right"
                      : "bg-gray-300 text-gray-800 text-left"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {message.user} •{" "}
                  {message.createdAt
                    ? new Date(message.createdAt.toDate()).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Message Input Form */}
      <form
        className="flex items-center border-t border-gray-200 p-3 bg-white rounded-b-lg relative"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          placeholder="Type your message here..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <button
          type="submit"
          className="ml-3 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Send
        </button>
      </form>
    </div>
  </div>
  );
}
export default Chat;
