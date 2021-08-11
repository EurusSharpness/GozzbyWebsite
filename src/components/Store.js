import React, {useEffect, useState} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import {FirebaseAuth, users} from "./firebase_functions";
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


export function Store(props) {
    const [user, setUser] = useState(null);
    const [drawer_open, setDrawerOpen] = useState(false);
    const [products, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState(SortByAscending); // 0 = No Sorting.
    const [filterBy, setFilterBy] = useState(NoFilter);
    const [UsermodalShow, setUserModalShow] = React.useState(false);
    const [userdocument, setUserdocument] = React.useState(null);
    const [username, setusername] = React.useState('');


    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(async u => {
            if (u) {
                setIsLoading(true);
                setUser(u);
                await handleSignIn(setProduct);
                users.doc(u.email).get().then((data)=>{
                   setusername(data.data().name);
                });
                setUserdocument(users.doc(u.email));
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
                    <Typography color="inherit" style={{marginRight: 30}} onClick={()=>{
                        // props.history.push('/client')
                        setUserModalShow(true);
                    }}>
                        Hi! {username}
                    </Typography>
                    <Button color="inherit" onClick={() => handleSignOut(props)}>
                        Sign out
                    </Button>
                    <UserModal
                        show={UsermodalShow}
                        onHide = {()=>setUserModalShow(false)}
                        clientdocument = {userdocument}
                        currentuser = {user}
                        setusername = {setusername}
                    />
                </Toolbar>
            </AppBar>
            <Drawer open={drawer_open} onClose={handleCloseDrawer}>
                I'm a drawer
            </Drawer>

            {/* ----------- Test Filter and Sort functions --------------*/}
            {AddSortAndFilterButtonsForTest(setSortBy, setFilterBy)}
            {/*--------------------------- END TEST ----------------------*/}

            {products ? getProducts(products, sortBy, filterBy) : ''}
        </div>
    );
}

function Sort(setSortBy, setFilterBy){
    const SortSelectedVal=document.getElementById("Sort").value;
    const FilterSelectedVal=document.getElementById("Filter").value;
    // console.log(`Sort by: ${SortSelectedVal}   filter by ${FilterSelectedVal}`);
    setFilterBy(FilterSelectedVal);
    setSortBy(SortSelectedVal);
}
function AddSortAndFilterButtonsForTest(setSortBy, setFilterBy) {
    return (
        <div>
            filter by  :
            <select onClick={()=>Sort(setSortBy,setFilterBy)} key={0} id="Filter">
                <option value={"vodka"}  key={1}>Filter by vodka</option>
                <option value={"whiskey"}  key={2}>Filter by whiskey</option>
                <option value={"beer"}  key={3}>Filter by beer</option>
                <option value={"tequila"}  key={4}>Filter by tequila</option>
                <option value={NoFilter} key={5}>Clear filter</option>
            </select>
            Sort By :
            <select onClick={()=>Sort(setSortBy,setFilterBy)} id="Sort" key={9}>
                <option value={SortByAscending} key={1}>Price low -> high</option>
                <option value={SortByDescending} key={2}>Price high -> low</option>
            </select>
        </div>
    );
}
