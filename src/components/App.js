import React, {useEffect, useState} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import {auth} from "./firebase_functions";


export function App(props) {
    const [user, setUser] = useState(null);
    const [drawer_open, setDrawerOpen] = useState(false);

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        return auth.onAuthStateChanged(u => {
            if (u) {
                setUser(u);
            } else {
                props.history.push("/");
            }
        });
    }, [props.history]);

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                props.history.push("/");
            })
            .catch(error => {
                alert(error.message);
            });
    };

    if (!user) {
        return <div/>;
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {
                            setDrawerOpen(true);
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        color="inherit"
                        variant="h6"
                        style={{marginLeft: 15, flexGrow: 1}}
                    >
                        My App
                    </Typography>
                    <Typography color="inherit" style={{marginRight: 30}}>
                        Hi! {user.email}
                    </Typography>
                    <Button color="inherit" onClick={handleSignOut}>
                        Sign out
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer open={drawer_open} onClose={handleCloseDrawer}>
                I'm a drawer
            </Drawer>
            {

            }
        </div>
    );
}
