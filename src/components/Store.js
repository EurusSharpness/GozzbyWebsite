import React, {useEffect, useState} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import {auth} from "./firebase_functions";
import Loading from "./Loading";
import {
    handleSignIn,
    handleSignOut,
    getProducts,
    SortByDescending,
    SortByAscending,
    NoFilter
} from "./Store_functions";


export function Store(props) {
    const [user, setUser] = useState(null);
    const [drawer_open, setDrawerOpen] = useState(false);
    // const [client, setClient] = useState(null);
    const [products, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState(SortByAscending); // 0 = No Sorting.
    const [filterBy, setFilterBy] = useState(NoFilter);

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        return auth.onAuthStateChanged(async u => {
            if (u) {
                setIsLoading(true);
                setUser(u);
                await handleSignIn(setProduct);
                setIsLoading(false);
            } else {
                props.history.push("/");
            }
        });
    }, [props.history]);


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
                    <Typography color="inherit" style={{marginRight: 30}}>
                        Hi! {user ? user.email.split('@')[0] : ''}
                    </Typography>
                    <Button color="inherit" onClick={() => handleSignOut(props)}>
                        Sign out
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer open={drawer_open} onClose={handleCloseDrawer}>
                I'm a drawer
            </Drawer>

            {/* ----------- Test Filter and Sort functions --------------*/}
            {AddSortAndFilterButtonsForTest(setSortBy, setFilterBy)}
            {/*---------------------------- END TEST ----------------------*/}

            {products ? getProducts(products, sortBy, filterBy) : ''}
        </div>
    );
}


function AddSortAndFilterButtonsForTest(setSortBy, setFilterBy) {
    return (
        <div>
            <button onClick={() => setSortBy(SortByAscending)}>
                Price low -> high
            </button>
            <button onClick={() => setSortBy(SortByDescending)}>
                Price high -> low
            </button>
            <button onClick={() => setFilterBy('vodka')}>
                Filter by vodka
            </button>
            <button onClick={() => setFilterBy('whiskey')}>
                Filter by whiskey
            </button>
            <button onClick={() => setFilterBy('beer')}>
                Filter by beer
            </button>
            <button onClick={() => setFilterBy('tequila')}>
                Filter by tequila
            </button>
            <button onClick={() => setFilterBy(NoFilter)}>
                Clear filter
            </button>
        </div>
    );
}