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
import "./Store.css";
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

function Sort(setSortBy, setFilterBy){
    var SortSelectedVal=document.getElementById("Sort").value;
    var FilterSelectedVal=document.getElementById("Filter").value;
    if (SortSelectedVal==="Price low -> high"){
        setSortBy(SortByAscending);
    }
    if (SortSelectedVal==="Price high -> low"){
        setSortBy(SortByDescending);
    }
    if (FilterSelectedVal==="Filter by vodka"){
        setFilterBy(`vodka`);
    }
    if (FilterSelectedVal==="Filter by whiskey"){
        setFilterBy('whiskey')
    }
    if (FilterSelectedVal==="Filter by beer"){
        setFilterBy('beer')
    }
    if (FilterSelectedVal==="Filter by tequila"){
        setFilterBy('tequila')
    }
    if (FilterSelectedVal==="Clear filter"){
        setFilterBy(NoFilter)
    }
}
function AddSortAndFilterButtonsForTest(setSortBy, setFilterBy) {
    return (
        <div>
            filter by  :
            <select onClick={()=>Sort(setSortBy,setFilterBy)} id="Filter">
                <option value="Filter by vodka">Filter by vodka</option>
                <option value="Filter by whiskey">Filter by whiskey</option>
                <option value="Filter by beer">Filter by beer</option>
                <option value="Filter by tequila">Filter by tequila</option>
                <option value="Clear filter">Clear filter</option>
            </select>
            Sort By :
            <select onClick={()=>Sort(setSortBy,setFilterBy)} id="Sort">
                <option value="Price low -> high">Price low -> high</option>
                <option value="Price high -> low">Price high -> low</option>
            </select>

        </div>
    );
}