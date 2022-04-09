import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import app from "./firebase.init";
import { useState } from "react";

const auth = getAuth(app);
function App() {
  const [name, setName] = useState('')
  const [error, setError] = useState('');
  const [registerd, setRegistered] = useState(false);
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleNamelBlur = event => {
   setName(event.target.value);
  }
  const handleResetPassword = () =>{
    sendPasswordResetEmail(auth, email)
    .then( () =>{
      console.log('password reset email sent')
    })
    .catch( error => {
      console.log(error)
    })
  }
  const handleRegisterChange = event => {
    setRegistered(event.target.checked)
  }
  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }
  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }
  const handleFormSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('Password should contain at least one special character')
      return;

    }


    setValidated(true);
    setError('');
    if (registerd) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user)
        })
        .catch(error => {
          setError(error)
        })

    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user)
        })
        .catch(error => {
          console.error(error)
          setEmail('')
          setPassword('');
          setUserName();
          verifyEmail();
        })
    }


    event.preventDefault();
  }
  const setUserName = () => {
    updateProfile(auth.currentUser,{
      displayName: name
    })
    .then( () => {
      console.log('updating name')
    })
    .catch(error => {
      setError(error.message)
    })
  }
  const verifyEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then( () =>{
      console.log('email verification sent')

    })
  }
 
  return (
    <div>
      <div className="registration w-50 mx-auto mt-5">
        <p className="text-primary">Please {registerd ? 'login' : 'Register'}</p>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          { !registerd && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control onBlur={handleNamelBlur} type="text" placeholder="Enter your name" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>

          </Form.Group>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>

          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisterChange} type="checkbox" label="Already Register" />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button onClick={handleResetPassword} variant="">forget password</Button>
          <br />

          <Button variant="primary" type="submit">
            {registerd ? 'login' : 'Register'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
