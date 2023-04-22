import React from "react";
import "./Message.css";
import { useState, useEffect } from "react";

const Message = ({ data, user }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    if (data.date > 0) {
      let d = new Date(data.date.seconds * 1000);
      let hours = d.getHours();
      let min = d.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      min = min < 10 ? "0" + min : min;
      setTime(`${hours}:${min}`);
    }
  }, [data]);
  return (
    <div
      className="messageLine"
      style={{
        justifyContent: user.id === data.author ? "flex-end" : "flex-start",
      }}
    >
      <div
        className="messageItem"
        style={{
          backgroundColor: user.id === data.author ? "#005C4B" : "#202C33",
        }}
      >
        <div className="messageText">{data.body}</div>
        <div className="messageDate">{time}</div>
      </div>
    </div>
  );
};

export default Message;
