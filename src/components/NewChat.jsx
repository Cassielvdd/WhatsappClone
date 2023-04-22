import React, { useEffect, useState } from "react";
import "./NewChat.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api";

const NewChat = ({ show, setWShow, user, chatlist }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    async function getList() {
      if (user !== null) {
        let results = await api.getContactList(user.id);
        setList(results);
      }
    }
    getList();
  }, [user]);
  function handleClose() {
    setWShow(!true);
  }
  async function addNewChat(user2) {
    await api.addNewChat(user, user2);

    handleClose();
  }
  return (
    <div className="newChat" style={{ left: show ? 0 : -415 }}>
      <div className="newChat--head">
        <div className="newChat--backbutton" onClick={handleClose}>
          <ArrowBackIcon style={{ color: "#fff" }} />
        </div>
        <div className="newChat--headtitle">Nova Conversa</div>
      </div>
      <div className="newChat--list">
        {list.map((item, key) => (
          <div
            className="newChat--item"
            key={key}
            onClick={() => addNewChat(item)}
          >
            <img className="avatar" src={item.avatar} alt="" />
            <div className="newChat--itemname">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewChat;
