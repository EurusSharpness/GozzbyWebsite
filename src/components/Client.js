import React from 'react';
import Loading from "./Loading";
import {FirebaseAuth, users, items, ClientClass} from "./firebase_functions"
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ConfirmCheckoutModal, DeleteModal} from "./Client_functions";
import {Button, Card, Container, Row} from "react-bootstrap";
import {Products} from "./Store_functions";
import {Col, Input} from "reactstrap";
import {AppBar, InputLabel} from "@material-ui/core";
import background from "../assets/StorePics/productback.jpg";
import cartbackground from "../assets/StorePics/Cartbackground.jpg"
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {MDBContainer, MDBMedia} from "mdbreact";
import {Table} from 'antd';
import "./Client.css";


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
                    if (itemsData)
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
                <div>
                <Row className="Cart-Items">
                    <Col  className="image-box">
                        <img  src={product.imagePath} style={{height: "120px"}}/>
                    </Col>
                    <Col></Col>
                    <Col  class="about">
                        <h6 style={{fontSize:"12px"}} class="title">{product.name}</h6>
                        <br/>
                        <h3 style={{fontSize:"12px"}} class="subtitle">{product.brand}</h3>
                    </Col>
                    <Col class="counter"></Col>
                    <Col class="prices"></Col>
                    <Col  class="counter">
                        <div class="btn">+</div>
                        <div class="count">2</div>
                        <div class="btn">-</div>
                    </Col>
                    <Col  class="prices">
                        <div style={{fontSize:"16px"}} class="amount">${product.price}</div>
                        <div class="remove"><u>Remove</u></div>
                    </Col>
                    <br/><br/><br/><br/><br/><br/>

                </Row>
                <hr/>
                </div>

            );
        };
        let result = [];
        for (let key in client_.cart) {
            result.push(handleItem(itemsData[key]))
        }
        return (
            <div style={{height:"2500px",backgroundImage: `url(${background})`}}>
                <AppBar style={{backgroundSize: "contain", backgroundImage: `url(${cartbackground})`}} position="static"
                        color="red">
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

                <Container style={{

                    paddingTop: '100px',
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"

                }}>
                    <div className="Cart-Container">
                        <div className="Header">
                            <h3 className="Heading">Shopping Cart</h3>
                            <h5 className="Action">Remove all</h5>
                        </div>
                        {result}
                        <div class="checkout">
                            <div class="total">
                                <div>
                                    <div class="Subtotal">Sub-Total</div>
                                    <div class="items">2 items</div>
                                </div>
                                <div class="total-amount">$6.18</div>
                            </div>
                            <button class="button">Checkout</button>
                        </div>
                    </div>

                </Container>

            </div>
        );
    };

    const handleItemDelete = async (itemID) => {
            await client_.deleteItem(itemID);
            calculateItemsSum();
        }
    ;

    const calculateItemsSum = () => {
        let sum = 0;
        for (let key in client_.cart) {
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
        }
    ;

    if (isLoading) {
        return (
            <div className={'Container'}>
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
                    <Button variant={"primary"} className={'shadow-none'} onClick={() => setCheckoutModalState(true)}>Check
                        Out Items Price
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
