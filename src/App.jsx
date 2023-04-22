import "./App.css";
import { DonutLarge } from "@mui/icons-material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";

//components
import ChatList from "./components/chatlistitem";
import ChatIntro from "./components/Chatintro";
import ChatWindow from "./components/ChatWindow";
import NewChat from "./components/NewChat";
import Login from "./components/Login";
import api from "./api";

function App() {
  const [showNewChat, setShowNewChat] = useState(false);
  const [chatlist, setChatllist] = useState([]);
  const [user, setUser] = useState(null);
  const [activeChat, setActiveChat] = useState({});

  useEffect(() => {
    if (user !== null) {
      let unsub = api.onChatList(user.id, setChatllist);
      return unsub;
    }
  }, [user]);

  async function handleLoginData(u) {
    let newUser = {
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL,
    };
    await api.addUser(newUser);
    setUser(newUser);
    console.log(newUser);
  }
  if (user === null) {
    return <Login onRecieve={handleLoginData} />;
  }

  return (
    <div className="App">
      <div className="sidebar">
        <NewChat
          show={showNewChat}
          setWShow={setShowNewChat}
          user={user}
          chatlist={chatlist}
        />
        <header>
          <img
            src={user.avatar}
            alt=""
            className="header--avatar"
            referrerPolicy="no-referrer"
          />
          <div className="header--buttons">
            <div className="header--btn">
              <DonutLarge style={{ color: "#919191" }} />
            </div>
            <div className="header--btn" onClick={() => setShowNewChat(true)}>
              <ChatIcon style={{ color: "#919191" }} />
            </div>
            <div className="header--btn">
              <MoreVertIcon style={{ color: "#919191" }} />
            </div>
          </div>
        </header>

        <div className="search">
          <div className="search--input">
            <SearchIcon fontSize="small" style={{ color: "#919191" }} />
            <input
              type="search"
              placeholder="Procurar ou Começar uma nova Conversa"
            />
          </div>
        </div>

        <div className="chatlist">
          {chatlist.map((item, key) => {
            return (
              <ChatList
                key={key}
                data={item}
                onClick={() => setActiveChat(chatlist[key])}
                active={activeChat.chatId === chatlist[key].chatId}
              />
            );
          })}
        </div>
      </div>
      <div className="contentarea">
        {activeChat.chatId !== undefined && (
          <ChatWindow user={user} data={activeChat} />
        )}
        {activeChat.chatId == undefined && <ChatIntro />}
      </div>
    </div>
  );
}

export default App;
