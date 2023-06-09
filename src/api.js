import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import firebaseConfig from "./firebaseConfig";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export default {
  fbPopup: async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("public_profile");
    let result = await firebase.auth().signInWithPopup(provider);
    return result;
  },
  GooglePopup: async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    let result = await firebase.auth().signInWithPopup(provider);
    return result;
  },
  addUser: async (u) => {
    await db.collection("users").doc(u.id).set(
      {
        name: u.name,
        avatar: u.avatar,
      },
      { merge: true },
    );
  },
  getContactList: async (userId) => {
    let list = [];
    let res = await db.collection("users").get();
    res.forEach((res) => {
      let data = res.data();
      if (res.id !== userId) {
        list.push({
          id: res.id,
          name: data.name,
          avatar: data.avatar,
        });
      }
    });
    return list;
  },
  addNewChat: async (user, user2) => {
    let newChat = await db.collection("chats").add({
      messages: [],
      users: [user.id, user2.id],
    });

    db.collection("users")
      .doc(user.id)
      .update({
        chats: firebase.firestore.FieldValue.arrayUnion({
          chatId: newChat.id,
          title: user2.name,
          image: user2.avatar,
          with: user2.id,
        }),
      });
    db.collection("users")
      .doc(user2.id)
      .update({
        chats: firebase.firestore.FieldValue.arrayUnion({
          chatId: newChat.id,
          title: user.name,
          image: user.avatar,
          with: user.id,
        }),
      });
  },
  onChatList: (userid, setChatllist) => {
    return db
      .collection("users")
      .doc(userid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          let data = doc.data();
          if (data.chats) {
            let chats = [...data.chats];
            chats.sort((a, b) => {
              if (a.lastMessageDate === undefined) {
                return -1;
              }
              if (b.lastMessageDate === undefined) {
                return -1;
              }
              if (a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
                return 1;
              } else {
                return -1;
              }
            });

            setChatllist(data.chats);
          }
        }
      });
  },
  onChatContent: (chatId, setList, setUsers) => {
    return db
      .collection("chats")
      .doc(chatId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          let data = doc.data();
          setList(data.messages);
          setUsers(data.users);
        }
      });
  },
  sendMessage: async (chatData, userId, type, body, users) => {
    let now = new Date();
    db.collection("chats")
      .doc(chatData.chatId)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          type,
          author: userId,
          body,
          date: now,
        }),
      });
    for (let i in users) {
      let u = await db.collection("users").doc(users[i]).get();
      let uData = u.data();
      if (uData.chats) {
        let chats = [...uData.chats];
        for (let e in chats) {
          if (chats[e].chatId === chatData.chatId) {
            chats[e].lastMessage = body;
            chats[e].lastMessageDate = now;
          }
        }
        await db.collection("users").doc(users[i]).update({
          chats,
        });
      }
    }
  },
};
