import { IonContent, IonPage, isPlatform } from '@ionic/react';
import { useRef, useState } from 'react';
import styled from "styled-components"
import { Link } from 'react-router-dom';
import axios from "axios"
import { useHistory } from 'react-router';

import { firebaseAuth } from '../auth/firebase';


const ShowPasswordBtn = styled.span`
    color: ${props => props.passwordForm == "password" ? "grey" : "blue"};
    padding-left: .7rem;
    :hover {
      cursor: pointer
    };
    font-size: .75rem;
`

const ForgotPasswordBtn = styled.span`
    color: grey;
    padding-left: .7rem;
    :hover {
      cursor: pointer
    };
    font-size: .75rem;
    position: absolute;
    right: 10%;
    top: 56.27%
`

const emailRegExp = RegExp(
  /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
)

const passwordRegExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/


const LoginForm = () => {
  const passwordInputRef = useRef()
  const emailInputRef = useRef()

  const [passwordForm, setPasswordForm] = useState("password")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loginError, setLoginError] = useState("")

  const history = useHistory()

  const togglePassword = () => {
    setPasswordForm(passwordInputRef.current.type == "password" ? "text" : "password")
    passwordInputRef.current.type = passwordInputRef.current.type == "password" ? "text" : "password"
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    setLoginError("")
    if (!emailRegExp.test(emailInputRef.current.value)) {
      setEmailError("Enter a valid email")
    } else { setEmailError("") }
    
    if (!emailError) {
      try {
        let res = await firebaseAuth.signInWithEmailAndPassword(emailInputRef.current.value, passwordInputRef.current.value)
        if (res.user.uid) {
          let users = await axios.get(`DB_URL`)
          for (const key in users.data) {
            let matchfound = users.data[key].email == emailInputRef.current.value;
            if (matchfound) {
              history.push("/home")
              break
              //proceed
            }
          }
        }
      } catch (err) {
        setLoginError(err.message)
      }
    }
  }

  const authLoginHandler = async (provider) => {
    try {
      if (isPlatform("mobile")) {
        await firebaseAuth.signInWithRedirect(provider)
        let res = await firebaseAuth.getRedirectResult()
        console.log(res);
      } else {
        let res = await firebaseAuth.signInWithPopup(provider)
        console.log(res);
      }
    } catch (err) {
      console.log(err);
      setLoginError(err.message)
    }
  }

  return (
    <IonPage>
      <IonContent>
        <div className="container">
          <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
              <div className="card card-signin my-5">
                <div className="card-body">
                  <h5 className="card-title text-center">Sign In</h5>
                  <form className="form-signin" autoComplete="on" onSubmit={submitHandler}>
                    <label style={{ color: "red", paddingLeft: "0.7rem", fontSize: ".75rem", display: `${emailError || loginError ? "block" : "none"}` }}>{loginError ? loginError : emailError}</label>
                    <div className="form-label-group">
                      <input type="email" style={{ color: "black" }} id="inputEmail" name="email" className="form-control" placeholder="Email address" autoComplete="email" required ref={emailInputRef} />
                      <label htmlFor="inputEmail">Email address</label>
                    </div>

                    {/* <label style={{ color: "red", paddingLeft: "0.7rem", fontSize: ".75rem", display: `${loginError ? "block" : "none"}` }}>{loginError}</label> */}
                    <div className="form-label-group" style={{ marginBottom: ".3rem" }}>
                      <input type="password" id="inputPassword" name="current-password" ref={passwordInputRef} className="form-control" placeholder="Password" required autoComplete="current-password" />
                      <label htmlFor="inputPassword">Password</label>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <ShowPasswordBtn onClick={togglePassword} passwordForm={passwordForm}>Show Password</ShowPasswordBtn>
                      <ForgotPasswordBtn><Link to="/reset-password" style={{ color: "gray" }}>Forgot Password?</Link></ForgotPasswordBtn>
                    </div>

                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign in</button>
                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="button" onClick={() => history.push('/signup')}>Sign up</button>
                    {/* <hr />
                    <button className="btn btn-lg btn-google btn-block text-uppercase" onClick={() => authLoginHandler(new firebase.auth.GoogleAuthProvider())} type="button"><i className="fab fa-google mr-2"></i> Sign in with Google</button>
                    <button className="btn btn-lg btn-facebook btn-block text-uppercase" onClick={authLoginHandler.bind(this, new firebase.auth.FacebookAuthProvider())} type="button"><i className="fab fa-facebook-f mr-2"></i> Sign in with Facebook</button> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginForm;
