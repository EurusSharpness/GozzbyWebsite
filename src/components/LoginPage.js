import React, {useEffect, useState} from "react";
import {FirebaseAuth, users} from "./firebase_functions";
import {Link} from "react-router-dom";
import "./login.css"
import loginbackground from "../assets/LoginPagePics/woodback.jpg"
import Loading from "./Loading";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBModalFooter,
    MDBRow
} from "mdb-react-ui-kit";
import {Button, Col, Row} from "react-bootstrap";

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
        return <Loading/>
    return (

        <div style={{padding: "50px", height: "1500px", backgroundImage: `url(${loginbackground})`}}>
            <MDBContainer style={{
                width: "100%",
                textAlign: "center",
            }}>
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
                            validate
                            labelClass='white-text'
                        />
                        <br/><br/>
                        <Row>
                            <Col md={12} sm={12} style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                Don't have an account? <Link to="/signup">Sign up!</Link>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col md={12} sm={12} style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                Forgot your password? <Link to="/reset_password">Reset password!</Link>
                            </Col>
                        </Row>
                        <br/><br/>

                        <MDBRow className='d-flex align-items-center mb-4'>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Button
                                    variant="success"
                                    onClick={handleSignIn}
                                    rounded
                                    style={{width: "150px", fontSize: "18px"}}
                                >
                                    Sign in
                                </Button>
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
            document.getElementById("password2error").style.color = "red";
            document.getElementById("password2error").innerText = "passwords do not match !"
            flag = false;
        } else {
            document.getElementById("password2error").style.color = "lightgreen";
            document.getElementById("password2error").innerText = "passwords match !"
            flag = true;
        }
        console.log(flag);
    };
    const createUserInDatabase = async (email) => {
        await users.doc(email).set({cart: {}, name: email.split('@')[0]});
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
        <div style={{padding: "50px", height: "1500px", backgroundImage: `url(${loginbackground})`}}>
            <MDBContainer style={{
                width: "100%",
                textAlign: "center",
            }}>
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
                                    <strong> Up</strong>
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
                            label='Your email'
                            validate
                            labelClass='white-text'
                        />
                        <MDBInput
                            onChange={e => {
                                setPassword(e.target.value);
                                handlePasswordChange();
                            }}
                            onKeyDown={(key) => {
                                if (key.key === 'Enter') handleSignUp();
                            }}
                            value={password}
                            type="password"
                            id="password"
                            className="form-control"
                            label='password'
                            validate
                            labelClass='white-text'
                        />

                        <MDBInput
                            onChange={e => {
                                setConfirm_Password(e.target.value);
                                handlePasswordChange();
                            }}
                            onKeyDown={(key) => {
                                if (key.key === 'Enter') handleSignUp();
                            }}
                            value={confirm_password}
                            type="password"
                            id="cpassword"
                            className="form-control"
                            label='Confirm password '
                            validate
                            labelClass='white-text'
                        />
                        <span className={"error"}><p id="password1error"/></span>
                        <span className={"error"}><p id="password2error"/></span>
                        <br/>
                        <div>
                            login into existing account <Link to="/">Sign in!</Link>
                        </div>

                        <br/><br/><br/>
                        <MDBRow className='d-flex align-items-center mb-4'>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Button
                                    onClick={handleSignUp}
                                    variant="success"
                                    type="submit"
                                    color='success'
                                    style={{width: "150px", fontSize: "18px"}}
                                >
                                    Sign up
                                </Button>
                            </div>
                        </MDBRow>
                    </div>
                </MDBCard>
            </MDBContainer>
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
        <div style={{padding: "50px", height: "1500px", backgroundImage: `url(${loginbackground})`}}>
            <MDBContainer style={{
                width: "100%",
                textAlign: "center",
            }}>
                <MDBCard style={{
                    display: "inline-block",
                    margin: "0 auto",
                    padding: "3px",
                    width: '28rem'
                }}>
                    <MDBCardBody>
                        <MDBCardHeader className="form-header warm-flame-gradient rounded">
                            <h3 className="my-3">
                                <MDBIcon icon="lock"/> Reset password
                            </h3>
                        </MDBCardHeader>
                        <form>
                            <br/><br/>
                            <div className="grey-text">
                                <MDBInput
                                    fullWidth={true}
                                    placeholder="email"
                                    value={email}
                                    onChange={e => {
                                        setEmail(e.target.value);
                                    }}
                                    onKeyDown={(key) => {
                                        if (key.key === 'Enter') handleResetPassword();
                                    }}
                                />

                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <MDBBtn
                                    onClick={handleResetPassword}
                                    className="mb-3"
                                    type="submit"
                                    color="deep-orange"
                                >
                                    Send
                                </MDBBtn>
                            </div>
                        </form>
                        <MDBModalFooter style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div
                                className="font-weight-light">
                                Not a member? <Link to="/signup">Sign up!</Link>
                            </div>
                        </MDBModalFooter>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </div>
    )
}
