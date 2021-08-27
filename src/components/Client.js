import React from 'react';
import Loading from "./Loading";
import {FirebaseAuth, users, items, ClientClass} from "./firebase_functions"
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {ConfirmCheckoutModal, DeleteModal} from "./Client_functions";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {Products} from "./Store_functions";
import {Input} from "reactstrap";
import {AppBar, InputLabel} from "@material-ui/core";
import {MDBCard, MDBCardImage, MDBCardTitle, MDBFooter, MDBListGroup, MDBListGroupItem} from "mdb-react-ui-kit";
import background from "../assets/StorePics/productback.jpg";
import cartbackground from "../assets/StorePics/Cartbackground.jpg"
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";


/**
 * @param {firebase.User} u
 * @param setItemsData
 * @param setClientClass
 */
async function loadClient(u, setItemsData, setClientClass) {


    let client = await users.doc(u.email).get();

    let data = client.data();
    setClientClass(new ClientClass(users.doc(u.email), data));
    let m = {};
    for (let key in data.cart) {
        let t = (await items.doc(key).get()).data();
        m[key] = new Products(key, {
            name: t.name,
            imagePath: t.imagePath,
            quantity: t.quantity,
            brand: t.brand,
            price: t.price,
            description: t.description
        });

    }
    setItemsData(m);
}


export function ClientCart(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [itemsData, setItemsData] = useState(null);
    const [client_, setClientClass] = React.useState(null);
    const [deleteModalState, setDeleteModalState] = React.useState(false);
    const [checkoutModalState, setCheckoutModalState] = React.useState(false);
    const [currentItemID, setCurrentItemID] = React.useState(-1);
    const [currentItemQuantity,] = React.useState([]);
    const [itemsPriceSum, setItemsPriceSum] = React.useState(0);
    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(async u => {
            await loadClient(u, setItemsData, setClientClass);
            if (!client_) return;
            if (isLoading) {
                let sum = 0;
                for (let key in client_.cart) {
                    currentItemQuantity[key] = client_.cart[key];
                    if(itemsData)
                        sum += Number(Number(itemsData[key] ? itemsData[key].price : 0).toFixed()) * Number(currentItemQuantity[key]);
                }
                setItemsPriceSum(sum);
            }
            setIsLoading(false);
        })
    }, [client_, currentItemQuantity, isLoading, itemsData, props.history]);


    const getClientCart = () => {
        /**
         * @param {Products} product
         */
        const handleItem = (product) => {
            return (
                    <div style={{paddingTop:"50px"}}  className="col-md-4 mb-4 d-flex align-items-stretch">
                        <MDBCard  alignment="center">
                            <Row>
                                <Col sm={4}>
                                    <InputLabel style={{fontSize: '24px'}}>Quantity</InputLabel>
                                </Col>
                                <Col sm={6}>
                                    <Input value={currentItemQuantity[product.id]} onChange={(e) => {
                                        currentItemQuantity[product.id] = e.target.value;
                                    }}
                                           onBlur={async (e) => {
                                               let val = Number(e.target.value);
                                               if (e.target.value.length === 0)
                                                   val = 1;
                                               if (isNaN(val))
                                                   val = 1;
                                               if (val > 50)
                                                   val = 50;
                                               if (val < 1)
                                                   val = 1;
                                               currentItemQuantity[product.id] = val;
                                               await client_.changeItemQuantity(product.id, val);
                                               calculateItemsSum();
                                           }}>
                                    </Input>
                                </Col>
                            </Row>
                            <MDBCardImage class="img-fluid" src={product.imagePath} alt='...' position='top'/>
                            <Card.Body>
                            </Card.Body>
                            <MDBFooter>
                                <MDBListGroup flush>
                                    <MDBCardTitle>
                                        {product.name}
                                    </MDBCardTitle>
                                    <MDBListGroupItem>{product.brand}</MDBListGroupItem>
                                    <MDBListGroupItem>${product.price}</MDBListGroupItem>
                                </MDBListGroup>
                            <Button  variant="outlined" color="red"
                                    onClick={() => {
                                        setDeleteModalState(true);
                                        setCurrentItemID(product.id);
                                    }}>Delete</Button>
                            </MDBFooter>
                        </MDBCard>
                    </div>
            );
        };
        let result = [];
        for (let key in client_.cart) {
            result.push(handleItem(itemsData[key]))
        }
        return (
            <div  style={{ backgroundImage: `url(${background})` }}>
                <AppBar style={{backgroundSize:"contain", backgroundImage: `url(${cartbackground})` }} position="static" color="red">
                    <Toolbar>
                        <Typography
                            color="black"
                            variant="h6"
                            style={{marginLeft: 15, flexGrow: 1}}
                        >
                            Gozzby Store
                        </Typography>

                    </Toolbar>
                </AppBar>
            <Container>
                {result}
            </Container>

            </div>
        );
    };

    const handleItemDelete = async (itemID) => {
        await client_.deleteItem(itemID);
        calculateItemsSum();
    };

    const calculateItemsSum = () => {
        let sum = 0;
        for(let key in client_.cart){
            sum += Number(Number(itemsData[key].price).toFixed()) * Number(currentItemQuantity[key]);
        }
        console.log('Sum = ' + sum);
        setItemsPriceSum(sum);
    }

    const handleCheckOut = async () => {
        setIsCheckingOut(true);
        await client_.clearCart();
        client_.cart = [];
        calculateItemsSum();
        setIsCheckingOut(false);
    };

    if (isLoading) {
        return (
            <div className={'Container'}>
                Loading Cart!!
                <Loading/>
            </div>
        );
    }

    if (isCheckingOut) {
        return (
            <div className={'Container'}>
                Checking out...
                <Loading/>
            </div>
        );
    }

    return (
        <div style={{display: "flex", paddingTop: '5%'}}>
            <Container fluid={true} className={''}>
                {getClientCart()}
                {/*  Modal Modal Modal for the delete button */}
                <DeleteModal
                    show={deleteModalState}
                    onHide={() => {
                        setDeleteModalState(false)
                    }}
                    onDelete={handleItemDelete}
                    currentitemid={currentItemID}
                />
                <Row>
                    Total item price: {itemsPriceSum}
                    <Button variant={"primary"} className={'shadow-none'} onClick={()=>setCheckoutModalState(true)}>Check Out Items Price
                        = {itemsPriceSum}</Button>
                </Row>
                <ConfirmCheckoutModal
                    show={checkoutModalState}
                    onHide={() => setCheckoutModalState(false)}
                    doconfirm={handleCheckOut}
                    itemsum={itemsPriceSum}
                />
            </Container>
        </div>
    );

}
