import React from 'react';
import Loading from "./Loading";
import {FirebaseAuth, users, items, ClientClass} from "./firebase_functions"
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';

import {ConfirmCheckoutModal, DeleteModal} from "./Client_functions";
import {Button, Col, Container, Row} from "react-bootstrap";
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
            if (product === undefined) return;
            return (
                <div
                    className="d-flex flex-row justify-content-between align-items-center p-2 bg-white mt-4 px-3 rounded">
                    <div className="mr-1"><img className="rounded" src={product.imagePath}
                                               width="70"/></div>
                    <div className="d-flex flex-column align-items-center product-details"><span
                        className="font-weight-bold">{product.name}</span>
                        <div className="d-flex flex-row product-desc">
                            <div className="size mr-1"><span className="text-grey">Brand:</span><span
                                className="font-weight-bold">&nbsp;{product.brand}</span></div>
                        </div>
                    </div>
                    <div className="d-flex flex-row align-items-center qty"><i className="fa fa-minus text-danger"
                                                                               onClick={() => {
                                                                                   handleItemDecrease(product.id)
                                                                               }}/>
                        <h5 className="text-grey mt-1 mr-1 ml-1">{client_.cart[product.id]}</h5><i
                            className="fa fa-plus text-success" onClick={() => {
                            handleItemIncrease(product.id)
                        }}/>
                    </div>
                    <div>
                        <h5 className="text-grey">${product.price}</h5>
                    </div>
                    <div className="d-flex align-items-center"><i className="fa fa-trash mb-1 text-danger"
                                                                  onClick={() => {
                                                                      setCurrentItemID(product.id);
                                                                      setDeleteModalState(true);

                                                                  }}/></div>
                </div>
            );
        };
        let result = [];
        for (let key in client_.cart) {
            result.push(handleItem(itemsData[key]))
        }
        return (
            <Container className="mt-5 mb-5">
                <Row className="d-flex justify-content-center" style={{width: '100%'}}>
                    <Col md={8}>
                        <div className="p-2">
                            <h4>Shopping cart</h4>
                        </div>
                        {result}
                    </Col>
                </Row>
            </Container>
        );
    };

    const handleItemIncrease = async (itemID) => {
        await client_.changeItemQuantity(itemID, client_.cart[itemID] + 1);
    };

    const handleItemDecrease = async (itemID) => {
        await client_.changeItemQuantity(itemID, client_.cart[itemID] - 1);
    };

    const handleItemDelete = async (itemID) => {
        await client_.deleteItem(itemID);
        calculateItemsSum();
    };

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
