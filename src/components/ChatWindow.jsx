import React, { useEffect, useState, useRef } from "react";
import "./chatwindow.css";
import Message from "./Message";
import api from "../api";

//MATERIAL ICONS
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { Close } from "@mui/icons-material";

//EMOJI PICKER
import EmojiPicker from "emoji-picker-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ChatWindow = ({ user, data }) => {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [text, setText] = useState("");
  const [recordbtn, setRecordbtn] = useState(false);
  const [list, setlist] = useState([]);
  const [users, setUsers] = useState([]);

  const body = useRef();
  useEffect(() => {
    setlist([]);
    let unsub = api.onChatContent(data.chatId, setlist, setUsers);
    return unsub;
  }, [data.chatId]);
  useEffect(() => {
    if (body.current.scrollHeight > body.current.offsetHeight) {
      body.current.scrollTop =
        body.current.scrollHeight - body.current.offsetHeight;
    }
  }, [list]);
  //VOZ RECONHECIMENTO
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  function handleOpenEmoji() {
    setEmojiOpen(true);
  }
  function handleCloseEmoji() {
    setEmojiOpen(false);
  }

  function handleSendClick() {
    if (text !== "") {
      api.sendMessage(data, user.id, "text", text, users);
      setText("");
      setEmojiOpen(false);
    }
  }
  function handleInputKeyup(e) {
    if (e.keyCode == 13) {
      handleSendClick();
    }
  }

  return (
    <div className="chatWindow">
      <div className="chatWindow--header">
        <div className="chatWindow--headerinfo">
          <img src={data.image} alt="" className="chatWindow--avatar" />
          <div className="chatWindow--name">{data.title}</div>
        </div>
        <div className="chatWindow--headerbuttons">
          <div className="chatWindow--btn">
            <SearchIcon fontSize="small" style={{ color: "#919191" }} />
          </div>
          <div className="chatWindow--btn">
            <AttachFileIcon fontSize="small" style={{ color: "#919191" }} />
          </div>
          <div className="chatWindow--btn">
            <MoreVertIcon fontSize="small" style={{ color: "#919191" }} />
          </div>
        </div>
      </div>
      <div ref={body} className="chatWindow--body">
        {list.map((item, key) => (
          <Message key={key} data={item} user={user} />
        ))}
      </div>

      <div
        className="chatWindow--emojiarea"
        style={{ height: emojiOpen ? "400px" : "0px" }}
      >
        <EmojiPicker
          searchDisabled
          skinTonesDisabled
          onEmojiClick={(emojiObject) =>
            setText((text) => text + emojiObject.emoji)
          }
        />
      </div>

      <div className="chatWindow--footer">
        <div className="chatWindow--pre">
          <div className="chatWindow--btn" onClick={handleOpenEmoji}>
            <InsertEmoticonIcon
              fontSize="small"
              style={{ color: emojiOpen ? "#009688" : "#919191" }}
            />
          </div>
          <div
            className="chatWindow--btn"
            onClick={handleCloseEmoji}
            style={{ width: emojiOpen ? 40 : 0 }}
          >
            <Close fontSize="small" style={{ color: "#919191" }} />
          </div>
        </div>
        <div className="chatWindow--inputarea">
          <input
            type="text"
            className="chatWindow--input"
            placeholder="Digite uma mensagem..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleInputKeyup}
          />
        </div>
        <div className="chatWindow--pos">
          {text == "" && (
            <>
              <div
                className="chatWindow--btn"
                onClick={function handleOpenMic() {
                  SpeechRecognition.startListening();
                  setRecordbtn(true);
                  if (!browserSupportsSpeechRecognition) {
                    alert(
                      `Reconhecimento de Voz não funciona no ${window.navigator.userAgent}`,
                    );
                    alert("Use navegadores chromium");
                    setRecordbtn(false);
                  }
                  setText((text) => text + transcript);
                }}
              >
                <KeyboardVoiceIcon
                  fontSize="small"
                  style={{ color: "#919191" }}
                />
              </div>
              <div
                className="chatWindow--btn"
                style={{ width: recordbtn ? 40 : 0 }}
                onClick={function handleCloseMic() {
                  SpeechRecognition.stopListening();
                  resetTranscript();
                  setRecordbtn(false);
                }}
              >
                <Close fontSize="small" style={{ color: "#919191" }} />
              </div>
            </>
          )}
          {text !== "" && (
            <div className="chatWindow--btn" onClick={handleSendClick}>
              <SendIcon fontSize="small" style={{ color: "#919191" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
