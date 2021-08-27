import React, {useEffect, useState} from "react";
import {FirebaseAuth, users} from "./firebase_functions";
import {Link} from "react-router-dom";
import "./login.css"
import righthalf from "../assets/LoginPagePics/righthalf.jpg"
import loginbackground from "../assets/LoginPagePics/blackbricks.jpg"
import lefthalf from "../assets/LoginPagePics/lefthalf.jpg"
import Loading from "./Loading";
import {Container, Dropdown, Nav, Navbar, NavDropdown} from "react-bootstrap";
import AppBar from "@material-ui/core/AppBar";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Row} from "react-bootstrap";
import {Input} from "reactstrap";
import {MDBBtn, MDBCard, MDBCol, MDBContainer, MDBInput, MDBRow} from "mdb-react-ui-kit";

export function SignIn(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(u => {
            if (u) {
                props.history.push("/store");
            }
        });
    }, [props.history]);

    const handleSignIn = async () => {
        setIsLoading(true);
        await FirebaseAuth
            .signInWithEmailAndPassword(email, password)
            .then(() => {
            })
            .catch(error => {
                alert(error.message);
                setIsLoading(false);
            });
    };
    if (isLoading)
        return <div className={'Container'}><Loading/></div>
    return (
        <div style={{padding: "50px", height: "1500px", backgroundImage: `url(${loginbackground})`}}>
            <MDBContainer style={{width: "100%",
                textAlign: "center",}}>
                        <MDBCard
                            className='card-image'
                            style={{
                                display: "inline-block",
                                margin: "0 auto",
                                padding: "3px",
                                backgroundColor: "#8ebf42",
                                backgroundImage:
                                    'url(https://mdbcdn.b-cdn.net/img/Photos/Others/pricing-table7.jpg)',
                                width: '28rem'
                            }}
                        >
                            <div className='text-white rgba-stylish-strong py-5 px-5 z-depth-4'>
                                <div className='text-center'>
                                    <strong>Gozzby store</strong>
                                    <h3 className='white-text mb-5 mt-4 font-weight-bold'>

                                        <strong>SIGN</strong>
                                        <a href='#!' className='green-text font-weight-bold'>
                                            <strong> IN</strong>
                                        </a>
                                    </h3>
                                </div>
                                <MDBInput
                                    value={email}
                                    onChange={e => {
                                        setEmail(e.target.value);
                                    }}
                                    type="email"
                                    id="form2Example1"
                                    className="form-control"
                                    placeholder="Email address"
                                    label='Your email'
                                    group
                                    type='text'
                                    validate
                                    labelClass='white-text'
                                />
                                <MDBInput
                                    onChange={e => {
                                        setPassword(e.target.value);
                                    }}
                                    onKeyDown={(key) => {
                                        if (key.key === 'Enter') handleSignIn();
                                    }}
                                    value={password}
                                    type="password"
                                    id="form2Example2"
                                    className="form-control"
                                    placeholder="Password"
                                    label='Your password'
                                    group
                                    type='password'
                                    validate
                                    labelClass='white-text'
                                />
                                <br/><br/>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    Don't have an account? <Link to="/signup">Sign up!</Link>
                                </div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    Forgot your password? <Link to="/reset_password">Reset password!</Link>
                                </div>
                                <br/><br/><br/>
                                <MDBRow className='d-flex align-items-center mb-4'>
                                    <div className='text-center mb-3 col-md-12'>
                                        <MDBBtn
                                            onClick={handleSignIn}
                                            type="submit"
                                            className="btn btn-primary btn-block mb-4"
                                            color='success'
                                            rounded
                                            type='button'
                                            className='btn-block z-depth-1'
                                        >
                                            Sign in
                                        </MDBBtn>
                                    </div>
                                </MDBRow>
                            </div>
                        </MDBCard>

            </MDBContainer>

                {/****************/}
            </div>

    );
}

export function SignUp(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_Password] = useState("");
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(u => {
            if (u) {
                props.history.push("/store");
            }
        });
    }, [props.history]);
    let flag = false;
    const handlePasswordChange = () => {
        const p = document.getElementById("password").value;
        const cp = document.getElementById("cpassword").value;

        if (strongRegex.test(p)) {
            document.getElementById("password1error").style.color = "green";
            document.getElementById("password1error").innerText = 'password is strong';
            flag = true;

        } else if (mediumRegex.test(p)) {
            document.getElementById("password1error").style.color = "orange";
            document.getElementById("password1error").innerText = 'password is midium';
            flag = true;

        } else {
            document.getElementById("password1error").style.color = "red";
            document.getElementById("password1error").innerText = 'password is too weak';
            flag = false;

        }
        if (p.length === 0)
            return;
        if (p !== cp) {
            document.getElementById("password2error").innerText = "passwords do not match !"
            flag = false;
        } else {
            document.getElementById("password2error").innerText = "passwords match !"
            flag = true;
        }
        console.log(flag);
    };


    const createUserInDatabase = async (email) => {
        await users.doc(email).set({cart: [], name: email.split('@')[0]});
    }

    const handleSignUp = async () => {
        handlePasswordChange();
        console.log(flag);
        if (!flag)
            return;

        // if got here then all good.
        await FirebaseAuth
            .createUserWithEmailAndPassword(email, password)
            .then(async () => {
                console.log('Email created successfully');
                await createUserInDatabase(email);
            })
            .catch(error => {
                alert(error.message);
            });
    };

    return (
        <div style={{height: "500px", backgroundColor: "red"}}>
            <button>hey</button>
        </div>
    );
}

export function ResetPassword(props) {
    const [email, setEmail] = useState("");
    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(u => {
            if (u) {
                props.history.push("/store");
            }
        });
    }, [props.history]);
    const handleResetPassword = () => {
        console.log(email);
        FirebaseAuth.sendPasswordResetEmail(email).then(() => {
            alert('Email send successfully!');
            props.history.push('/'); // Go back to Sign in page if the mail was successfully sent!
        }).catch((e) => {
            alert('something went wrong!\n' + e);
        });

    }
    return (
        <div className={"back"}>

        </div>
    )
}
