import { IonContent, IonPage } from "@ionic/react";
import { useRef, useState } from "react";
import { firebaseAuth } from '../auth/firebase';

const emailRegExp = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
)

const ResetPassword: React.FC = () => {
    const emailInputRef = useRef<HTMLInputElement>()

    const [emailError, setEmailError] = useState("")

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!emailRegExp.test(emailInputRef.current.value)) {
            setEmailError("Enter a valid email")
        } else { setEmailError("") }

        if (!emailError) {
            try {
                let res = await firebaseAuth.sendPasswordResetEmail(emailInputRef.current.value)
                console.log(res);
            } catch (err) {
                console.log(err);
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
                                    <h5 className="card-title text-center">Reset Password</h5>
                                    <form className="form-signin" autoComplete="on" onSubmit={submitHandler}>
                                        <label style={{ color: "red", paddingLeft: "0.7rem", fontSize: ".75rem", display: `${emailError ? "block" : "none"}` }}>{emailError}</label>
                                        <div className="form-label-group">
                                            <input type="email" style={{ color: "black" }} id="inputEmail" name="email" className="form-control" placeholder="Email address" autoComplete="email" required ref={emailInputRef} />
                                            <label htmlFor="inputEmail">Email address</label>
                                        </div>

                                        <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Reset Password</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default ResetPassword;
