import React, { useState,useRef } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; //firebase SDK
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {useAuthState} from 'react-firebase-hooks/auth'  //firebase hooks
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyDD7PV0B2TVQF5YvT0onHNZXK0pAZyPddc",
  authDomain: "superchat-af4b2.firebaseapp.com",
  projectId: "superchat-af4b2",
  storageBucket: "superchat-af4b2.appspot.com",
  messagingSenderId: "1024067457638",
  appId: "1:1024067457638:web:8e5725df4139122bd393a7"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
            <h1>⚛️ supeRchat</h1>
            <SignOut/>
      </header>

    <section>
      {user ? <ChatRoom/> : <SignIn/>}
    </section>

    

    </div>
  );
}

function SignIn(){

  const signInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
   
  return(
    <div>
      <button onClick={signInWithGoogle}>sign in with google</button>
    </div>
  )
}

function SignOut(){
  return auth.currentUser &&(
      <button onClick={()=> auth.signOut()}>sign out</button>
  )
}

function ChatRoom(){

  const dummy = useRef()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField:'id'});

  const [formValue,setFormValue] = useState('');

  const sendMessage = async(e)=>{
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;

    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    
    })
    dummy.current.scrollIntoView({ behavior: 'smooth' });
    setFormValue('');

  }
  return(
    <div>
      <div>
          {messages && messages.map(msg=> <ChatMessage key={msg.id} message ={msg}/> )}
          
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>

          <button type="submit" disabled={!formValue}> 🕊️ </button>
      </form>

      
    </div>
  )

}

function ChatMessage(props){
    const {text,uid,photURL} = props.message; 
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return(
      <div className={`message ${messageClass}`}>

        <img src={photURL || 'https://pics.clipartpng.com/White_Dove_PNG_Clipart-70.png' } alt="" />
          <p>{text}</p>
      </div>  

    
    )

}








export default App;
