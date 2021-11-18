import { IonContent, IonPage } from '@ionic/react';
import { useRef, useState } from 'react';
import styled from "styled-components"
import firebase from 'firebase';
import axios from "axios"
import { Link } from 'react-router-dom';

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
    top: 78.1%
`

const emailRegExp = RegExp(
  /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
)

const passwordRegExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

const SignUpForm = () => {
  const firstNameInputRef = useRef()
  const lastNameInputRef = useRef()
  const phoneInputRef = useRef()
  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const [passwordForm, setPasswordForm] = useState("password")
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
    phoneNoError: ""
  })
  const [loginError, setLoginError] = useState("")

  const togglePassword = () => {
    setPasswordForm(passwordInputRef.current.type == "password" ? "text" : "password")
    passwordInputRef.current.type = passwordInputRef.current.type == "password" ? "text" : "password"
  }

  const submitHandler = async (e) => {
    e.preventDefault()    

    if (!passwordRegExp.test(passwordInputRef.current.value)) {
      setErrors((prevState) => ({ ...prevState, passwordError: "At least six characaters including a number, a lowercase characater and an uppercase characater" }))
    } else {
      setErrors((prevState) => ({ ...prevState, passwordError: "" }))
    }

    if (!emailRegExp.test(emailInputRef.current.value)) {
      setErrors((prevState) => ({ ...prevState, emailError: "Enter a valid email" }))
    } else {
      setErrors((prevState) => ({ ...prevState, emailError: "" }))
    }

    let length = phoneInputRef.current.value.includes("+") ? 14 : 11
    if (isNaN(phoneInputRef.current.value.slice(1)) || phoneInputRef.current.value.length != length) {
      setErrors((prevState) => ({ ...prevState, phoneNoError: "Enter a valid phone number" }))
    } else {
      setErrors((prevState) => ({ ...prevState, phoneNoError: "" }))
    }

    if (!errors.emailError && !errors.passwordError && !errors.phoneNoError) {
      try {
        let res = await firebase.auth().createUserWithEmailAndPassword(emailInputRef.current.value, passwordInputRef.current.value)
        if (res.user.uid) {
          const user = {
            firstName: firstNameInputRef.current.value,
            lastName: lastNameInputRef.current.value,
            email: emailInputRef.current.value,
            phoneNumber: phoneInputRef.current.value
          }
          await axios.put(`DB_URL`, user)
        }

      } catch (err) {
        setLoginError(err.message)
      }
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
                  <h5 className="card-title text-center">Sign up</h5>
                  <form className="form-signin" autoComplete="on" onSubmit={submitHandler}>
                  <label style={{ color: "red", paddingLeft: "0.7rem", fontSize: ".75rem", display: `${loginError ? "block" : "none"}` }}>{loginError}</label>
                    <div className="form-label-group">
                      <input type="firstName" id="firstName" name="firstName" className="form-control" placeholder="First name" required ref={firstNameInputRef} />
                      <label htmlFor="firstName">First name</label>
                    </div>

                    <div className="form-label-group">
                      <input type="lastName" id="lastName" name="lastName" className="form-control" placeholder="Last name" required ref={lastNameInputRef} />
                      <label htmlFor="lastName">Last name</label>
                    </div>

                    <label style={{ color: "red", paddingLeft: "0.7rem", fontSize: ".75rem", display: `${errors.phoneNoError ? "block" : "none"}` }}>{errors.phoneNoError}</label>
                    <div className="form-label-group">
                      <input type="tel" id="phoneNo" name="phoneNumber" className="form-control" placeholder="Phone number" required ref={phoneInputRef} />
                      <label htmlFor="phoneNo">Phone number</label>
                    </div>

                    <label style={{ color: "red", paddingLeft: "0.7rem", fontSize: ".75rem", display: `${errors.emailError ? "block" : "none"}` }}>{errors.emailError}</label>
                    <div className="form-label-group">
                      <input type="email" autoComplete="username" id="inputEmail" name="email" className="form-control" placeholder="Email address" required ref={emailInputRef} />
                      <label htmlFor="inputEmail">Email address</label>
                    </div>

                    <label style={{ color: "red", paddingLeft: "0.7rem", fontSize: ".75rem", display: `${errors.passwordError ? "block" : "none"}` }}>{errors.passwordError}</label>
                    <div className="form-label-group" style={{ marginBottom: ".3rem" }}>
                      <input type="password" name="addPassword" ref={passwordInputRef} id="addPassword" className="form-control" placeholder="Password" required autoComplete="new-password" />
                      <label htmlFor="addPassword">Password</label>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <ShowPasswordBtn onClick={togglePassword} passwordForm={passwordForm}>Show Password</ShowPasswordBtn>
                      <ForgotPasswordBtn><Link to="/login" style={{color: "gray"}}>Sign In Instead</Link></ForgotPasswordBtn>
                    </div>

                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign up</button>
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

export default SignUpForm;
