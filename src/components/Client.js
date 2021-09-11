import React from 'react';
import Loading from "./Loading";
import {FirebaseAuth, users, items, ClientClass} from "./firebase_functions"
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ConfirmCheckoutModal, DeleteModal} from "./Client_functions";
import {Button,  Col, Container, Row} from "react-bootstrap";
import {Products} from "./Store_functions";
import {Input} from "reactstrap";
import {AppBar} from "@material-ui/core";
import background from "../assets/StorePics/productback.jpg";
import cartbackground from "../assets/StorePics/Cartbackground.jpg"
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import "./Client.css";
import {AiTwotoneShopping} from "react-icons/ai";


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
    const [currentItemID] = React.useState(-1);
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
                        <Col md={1} sm={1}  style={{marginRight: "100px"}} className="image-box">
                            <img src={product.imagePath} style={{height: "120px"}} alt=" "/>
                        </Col>
                        <Col md={1} sm={1} style={{marginRight: "30px"}} class="about">
                            <h6 style={{fontSize: "12px"}} class="title">{product.name}</h6>
                            <br/>
                            <h3 style={{fontSize: "12px"}} class="subtitle">{product.brand}</h3>
                        </Col>
                        <Col style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }} md={6} sm={4}>
                            QTY

                            <Input style={{width: "80px"}} value={currentItemQuantity[product.id]} onChange={(e) => {
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
                        <Col style={{marginRight: "0px"}} md={2} sm={1} class="prices">
                            <div style={{fontSize: "16px"}} class="amount">${product.price}</div>
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
            <div style={{height: "2500px", backgroundImage: `url(${background})`}}>
                <AppBar style={{backgroundSize: "contain", backgroundImage: `url(${cartbackground})`}} position="static"
                        color="red">
                    <Toolbar>
                        <AiTwotoneShopping size={50} width="100%"/>
                        <Typography
                            color="black"
                            variant="h6"
                            style={{marginLeft: 15, flexGrow: 1}}
                        >
                            ORDER SUMMARY
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
