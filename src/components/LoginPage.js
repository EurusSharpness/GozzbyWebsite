import React, {useEffect, useState} from "react";
import {auth} from "./firebase_functions";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import './login.css';
import Loading from "./Loading";


export function SignIn(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = React.useState(false);

    useEffect(() => {
        return auth.onAuthStateChanged(u => {
            if (u) {
                props.history.push("/store");
            }
        });
    }, [props.history]);

    const handleSignIn = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(() => {
            })
            .catch(error => {
                alert(error.message);
            });
    };

    return (

        <div class="back">
            <AppBar class="appbar"  position="static" color="primary">
                <Toolbar>
                    <Typography color="inherit" variant="h6">
                    </Typography>
                </Toolbar>
            </AppBar>
            <div class="split left" style={{display: "flex", justifyContent: "center"}}>
                <div class="centered" style={{width: "400px", marginTop: 30, padding: "40px"}}>

                    <TextField
                        class="inputs"
                        fullWidth={true}
                        placeholder="email"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                        }}
                    />
                    <span className="error"><p id="Name_error"></p></span>
                    <TextField
                        class="inputs"
                        type={"password"}
                        fullWidth={true}
                        placeholder="password"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                        }}
                        onKeyDown={(key) => {
                            if (key.key === 'Enter') handleSignIn();
                        }}
                        style={{marginTop: 20}}
                    />
                    <span className="error"><p id="Name_error"></p></span>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "30px",
                            alignItems: "center",
                            color:"black"
                        }}
                    >
                        <div >
                            Don't have an account? <Link to="/signup">Sign up!</Link>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "30px",
                        alignItems: "center",
                        color:"black"
                    }}>
                        <div>
                        Forgot your password? <Link to="/reset_password">Reset password!</Link>
                        </div>
                    </div>
                    <br/>
                    <Button class="btn" color="primary" variant="contained" onClick={handleSignIn}>
                        login
                    </Button>

                </div>
            </div>
            <div class="split right">
                <div class="centered">

                </div>
            </div>
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
        return auth.onAuthStateChanged(u => {
            if (u) {
                props.history.push("/app");
            }
        });
    }, [props.history]);

    const handleSignUp = () => {
        if(password !== confirm_password)
        {
            document.getElementById("password2error").innerText='Passwords do not match';
            return;
        }
        if(strongRegex.test(password)){
            // PASSWORD IS STRONG!!

        }else if(mediumRegex.test(password)){
            // Password is medium!
        }else{
            // Password is too weak, show error... ayham do something :)
            return;
        }
        // if got here then all good.
        auth
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
            })
            .catch(error => {
                alert(error.message);
            });
    };

    return (
        <div className="back">
            <AppBar class="appbar" position="static" color="primary">
                <Toolbar>
                    <Typography color="inherit" variant="h6">
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className="split left1" style={{ display: "flex", justifyContent: "center"}}>
                <div className="centered" style={{width: "400px", marginTop: 30, padding: "40px"}}>

                    <TextField
                        class="inputs"
                        fullWidth={true}
                        placeholder="email"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                        }}
                    />
                    <TextField
                        class="inputs"
                        type={"password"}
                        fullWidth={true}
                        placeholder="Password"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                        }}
                        style={{marginTop: 20}}
                    />
                    <span className="error"><p id="password1error"></p></span>
                    <TextField
                        class="inputs"
                        type={"password"}
                        fullWidth={true}
                        placeholder="Confirm password"
                        value={confirm_password}
                        onChange={e => {
                            setConfirm_Password(e.target.value);
                        }}
                        onKeyDown={(key) => {
                            if (key.key === 'Enter') handleSignUp();
                        }}
                        style={{marginTop: 20}}
                    />
                    <span className="error"><p id="password2error"></p></span>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "30px",
                            alignItems: "center",
                            color: "black"
                        }}
                    >
                        <div>
                            login into existing account <Link to="/">Sign in!</Link>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "30px",
                        alignItems: "center",
                        color: "black"
                    }}>
                        <div>
                            Forgot your password? <Link to="/reset_password">Reset password!</Link>
                        </div>
                    </div>
                    <br/>
                    <Button class="btn" color="primary" variant="contained" onClick={handleSignUp}>
                        login
                    </Button>

                </div>
            </div>
            <div className="split right">
                <div className="centered">

                </div>
            </div>
        </div>
    );
}

export function ResetPassword(props) {
    const [email, setEmail] = useState("");
    useEffect(() => {
        return auth.onAuthStateChanged(u => {
            if (u) {
                props.history.push("/app");
            }
        });
    }, [props.history]);
    const handleResetPassword = () => {
        console.log(email);
        auth.sendPasswordResetEmail(email).then(() => {
            alert('Email send successfully!');
            props.history.push('/'); // Go back to Sign in page if the mail was successfully sent!
        }).catch((e) => {
            alert('something went wrong!\n' + e);
        });

    }
    return (
        <div class="back">
            <AppBar class="appbar" position="static" color="primary">
                <Toolbar>
                    <Typography color="inherit" variant="h6">
                        Reset Password
                    </Typography>
                </Toolbar>
            </AppBar>
            <div style={{display: "flex", justifyContent: "center"}}>

                <Paper class="resetpass" style={{width: "400px", marginTop: 30, padding: "40px" , textAlign:"center", justifyContent: "center"}}>
                    <br/><br/>
                    <h4>when you fill in your email address , you will receive a instruction on how to reset your password.</h4>
                    <TextField
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
                    <Button class="btn" style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "30px",
                        alignItems: "center"
                    }} color="primary" variant="contained" onClick={handleResetPassword}>
                        send
                    </Button>
                </Paper>
            </div>
        </div>

    )
}
