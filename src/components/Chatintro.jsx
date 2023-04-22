import "./chatintro.css";
import Image from "./image-removebg-preview.png";
export default function ChatIntro() {
  return (
    <div className="chatIntro">
      <img src={Image} alt="" />
      <h1>WhatsApp Web</h1>
      <p>
        Envie e receba mensagens sem precisar manter seu celular conectado à
        internet.
      </p>
      <p>
        Use o WhatsApp em até quatro aparelhos conectados e um celular ao mesmo
        tempo.
      </p>
    </div>
  );
}
