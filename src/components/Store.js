import React, {useEffect, useState} from "react";
import AppBar from "@material-ui/core/AppBar";
import 'bootstrap/dist/css/bootstrap.css';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import {FirebaseAuth, users, ClientClass} from "./firebase_functions";
import Loading from "./Loading";
import "./Store.css";

import {
    handleSignIn,
    handleSignOut,
    getProducts,
    UserModal,
    SortByDescending,
    SortByAscending,
    NoFilter
} from "./Store_functions";
import {Dropdown} from "react-bootstrap";


export function Store(props) {
    const [user, setUser] = useState(null);
    const [drawer_open, setDrawerOpen] = useState(false);
    const [products, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState(SortByAscending); // 0 = No Sorting.
    const [filterBy, setFilterBy] = useState(NoFilter);
    const [UsermodalShow, setUserModalShow] = React.useState(false);
    const [userdocument, setUserdocument] = React.useState(null);
    const [userName, setuserName] = React.useState('');
    const [client_, setClientClass] = React.useState(null);
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(async u => {
            if (u) {
                setIsLoading(true);
                setUser(u);
                await handleSignIn(setProduct);

                await users.doc(u.email).get().then((data) => {
                    setuserName(data.data().name);
                    if (client_ === null) {
                        setClientClass(new ClientClass(users.doc(u.email), data.data()));
                    }
                });
                setUserdocument(users.doc(u.email));
                setIsLoading(false);
            } else {
                props.history.push("/");
            }
        });
    }, [client_, props.history]);


    if (!user) {
        return <div/>;
    }
    if (isLoading)
        return <div className={'Container'}>Getting Store Data!<Loading/></div>
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


                    <IconButton
                        style={{marginLeft: 20, flexGrow: 1}}
                        onClick={() => props.history.push('/client-cart')}
                    >Go To Cart
                    </IconButton>
                    <Typography color="inherit" style={{marginRight: 30}} onClick={() => {
                        // props.history.push('/client')
                        setUserModalShow(true);
                    }}>
                        Hi! {userName}
                    </Typography>
                    <Button color="inherit" onClick={() => handleSignOut(props)}>
                        Sign out
                    </Button>
                    <UserModal
                        show={UsermodalShow}
                        onHide={() => setUserModalShow(false)}
                        clientdocument={userdocument}
                        currentuser={user}
                        onNameSet={(name) => setuserName(name)}
                    />
                </Toolbar>
            </AppBar>
            <Drawer open={drawer_open} onClose={handleCloseDrawer}>
                I'm a drawer
            </Drawer>

            {/* ----------- Test Filter and Sort functions --------------*/}
            {AddSortAndFilterButtonsForTest(setSortBy, setFilterBy)}
            {/*--------------------------- END TEST ----------------------*/}
            {products ? getProducts(products, sortBy, filterBy, client_) : ''}
        </div>
    );
}


function AddSortAndFilterButtonsForTest(setSortBy, setFilterBy) {
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle className={'shadow-none'} variant="outline-primary" id="dropdown-sorting"
                                 style={{width: "auto", float: "left", marginLeft: '2%'}}>
                    Sort By
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onSelect={() => setSortBy(SortByAscending)}>Ascending</Dropdown.Item>
                    <Dropdown.Item onSelect={() => setSortBy(SortByDescending)}>descending</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>{''}

            <Dropdown>
                <Dropdown.Toggle className={'shadow-none'} variant="outline-primary" id="dropdown-filtering"
                                 style={{width: "auto", float: "left", marginLeft: '2px'}}>
                    Filter By
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onSelect={() => setFilterBy('vodka')}>Vodka</Dropdown.Item>
                    <Dropdown.Item onSelect={() => setFilterBy('beer')}>Beer</Dropdown.Item>
                    <Dropdown.Item onSelect={() => setFilterBy('whiskey')}>Whiskey</Dropdown.Item>
                    <Dropdown.Item onSelect={() => setFilterBy('tequila')}>Tequila</Dropdown.Item>
                    <Dropdown.Item onSelect={() => setFilterBy(NoFilter)}>Remove Filter</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
