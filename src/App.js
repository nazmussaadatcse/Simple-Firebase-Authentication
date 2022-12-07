import './App.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, GithubAuthProvider, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


// Initialize Firebase Authentication and get a reference to the service

const auth = getAuth(app);
function App() {

  const [user, setUser] = useState({});
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);


//signIn with google
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
        setUser(user);
        console.log('google');
        console.log(user);
      })
      .catch(error => {
        console.error('error', error);
      })
  }
//signIn with github

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const user = result.user;
        setUser(user);
        console.log('Github');
        console.log(user);
      })
      .catch(error => {
        console.error(error);
      })
  }

//signOut

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
      .catch(error => {
        setUser({});
      })
  }
//handle input email
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  //handle input password

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }


//handle form submit

  const handleFormSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
      //stop if input empty
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('Special Char Required!');
      return;
      //stop if not at least one special char
    }
    setValidated(true);
    setError('');
    //set error empty if input validated

//registered users
    if (registered) {
      signInWithEmailAndPassword(auth,email,password)
      .then(result=>{
        const user = result.user;
        console.log(user);
      })
      .catch(error=>{
        console.error(error);
        setError(error.message);
      })
    }
    //create user or register
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPassword('');
          verifyEmail();
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        })
    }
    event.preventDefault();
    //form submit no reload
  }

  //verify email
  const verifyEmail =()=>{
    sendEmailVerification(auth.currentUser)
    .then(()=>{
      console.log('Email verification sent!');
    })
  }

  //checkbox register conditions
  const handleRegisteredChange = event => {
    setRegistered(event.target.checked)
  }

  //rest password
  const handlePasswordReset=()=>{
    sendPasswordResetEmail(auth,email)
    .then(()=>{
      console.log('email sent!!');
    })
    .catch(()=>{
      console.error(error);
    })
  }

  return (
    <div className="">

      <div className="registration w-50 mx-auto mt-1">
        <h2 className='text-primary p-4'>Please {registered ? 'Login!' : 'Register!'}</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit} className='p-4'>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailChange} type="email" placeholder="Enter email" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordChange} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered?" />
          </Form.Group>

          <p className='text-danger'>{error}</p>
          <Button onClick={handlePasswordReset} variant="link">Forget Password</Button>
          <br/>
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>

      {
        user.uid ? <button className='w-50 mx-auto mt-1' onClick={handleSignOut}>Sign Out</button> :
          <div className='w-50 mx-auto mt-1'>
            <button onClick={handleGoogleSignIn}>Google Sign In</button>
            <button onClick={handleGithubSignIn}>GitHub Sign In</button>
          </div>
      }

      <div className='w-50 mx-auto mt-1'>
        <h4>Name: {user.displayName}</h4>
        <p>Email: {user.email}</p>
        <img src={user.photoURL} alt="" />
      </div>
    </div>
  );
}

export default App;
