import React, {useEffect, useState} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import {auth, users} from "./firebase_functions";


class Client {
    constructor(document, document_data) {
        this.doc = document;
        this.name = document_data.name;
        this.cart = document_data.cart;
    }

    async addItem(item_id) {
        if (this.cart == null) {
            console.log('Cannot add item, something wrong with data');
            return;
        }

        // Add new item to the cart with quantity 1 or
        // increase by 1 if already exist
        if (!this.cart.hasOwnProperty(item_id))
            this.cart[item_id] = 0;
        this.cart[item_id]++;
        // Might need to update visually as well!
        await this.doc.update({cart: this.cart}).then(() => {
            console.log('update successfully!');
        }).catch((error) => {
            console.log('error with update! ' + error);
        });
    };

    getCartDataInListForm() {

        return (
            <div>
                <p>   User Cart</p>
            <ul>
                {Object.keys(this.cart).map((item)=>{
                    return <li key={item}>{item}: {this.cart[item]}</li>
                })}
            </ul>
            </div>
        );
    };
}

export function App(props) {
    const [user, setUser] = useState(null);
    const [drawer_open, setDrawerOpen] = useState(false);
    const [client, setClient] = useState(null);
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        return auth.onAuthStateChanged(u => {
            if (u) {
                setUser(u);
                users.doc(u.email).get().then((document) => {
                    setClient(new Client(users.doc(u.email), document.data()));
                    console.log('client was loaded successfully from database');
                }).catch(error => console.log('Something went wrong when getting client, ' + error));
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
                        Hi! {client && client.name ? client.name : ""}
                        {}
                    </Typography>
                    <Button color="inherit" onClick={handleSignOut}>
                        Sign out
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer open={drawer_open} onClose={handleCloseDrawer}>
                I'm a drawer
            </Drawer>
            {/*THIS BUTTON IS FOR TESTING, CAN BE DELETED OR MODIFIED.*/}
            <Button color="inherit" onClick={() => {
                client.addItem(25).then(r => console.log(r ? r : ' '));
            }}>
                TEST ADD ITEM NUMBER 25 TO THE CURRENT USER
            </Button>
            {/* Check if null*/}
            {client ? client.getCartDataInListForm() : ''}
        </div>
    );
}
