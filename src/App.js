import './App.css';
import app from './firebase.init';
import {getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import { useState } from 'react';

// Initialize Firebase Authentication and get a reference to the service

const auth = getAuth(app);
function App() {

  const [user, setUser]= useState({});
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();


  const handleGoogleSignIn =()=>{ 
    signInWithPopup(auth,googleProvider)
    .then(result=>{
      const user = result.user;
      setUser(user);
      console.log('google');
      console.log(user);
    })
    .catch(error=>{
      console.error('error',error);
    })
  }

  const handleGithubSignIn=()=>{
    signInWithPopup(auth,githubProvider)
    .then(result=>{
      const user = result.user;
      setUser(user);
      console.log('Github');
      console.log(user);
    })
    .catch(error=>{
      console.error(error);
    })
  }

  const handleSignOut =()=>{
    signOut(auth)
    .then(()=>{
      setUser({});
    })
    .catch(error=>{
      setUser({});
    })
  }

  return (
    <div className="App">
      <form>
        <input type="email" name="" id="" />
        <input type="password" name="" id="" />
      </form>

      {
        user.uid? <button onClick={handleSignOut}>Sign Out</button>:
        <>
        <button onClick={handleGoogleSignIn}>Google Sign In</button>
        <button onClick={handleGithubSignIn}>GitHub Sign In</button>
        </>
      }
      
      <h2>Name: {user.displayName}</h2>
      <h2>Email: {user.email}</h2>
      <img src={user.photoURL} alt="" />
    </div>
  );
}

export default App;
