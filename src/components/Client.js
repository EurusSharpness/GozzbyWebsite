import React from 'react';
import Loading from "./Loading";
import {FirebaseAuth, users, items, ClientClass} from "./firebase_functions"
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';
import {ConfirmCheckoutModal, DeleteModal} from "./Client_functions";
import {Button, Card, Col, Container, ListGroup, Navbar, Row} from "react-bootstrap";
import {Products} from "./Store_functions";
import "./Client.css";
import MaterialTable from 'material-table';
import { BsFillPlusCircleFill } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";

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

        const columns = [
            {
                title: "Name",
                field: "name",
            },
            {
                title: "Brand",
                field: "brand",
            },
            {
                title: 'Image',
                field: 'img',
                render: item => <img src={item.imagePath} alt="" border="3" height="100" width="100"/>
            },
            {
                title: "Price",
                field: "price",
                render: item => <h2>${item.price}</h2>
            },
            {
                title: "Quantity",
                field: "quantity",
                render: item => <div><BsFillPlusCircleFill size={19}></BsFillPlusCircleFill><h2>{client_.cart[item.id]}</h2><AiFillMinusCircle size={19}></AiFillMinusCircle></div> // Add plus and minus buttons
            },
            {
                title: "",
                render: item => <Button variant="danger" onClick={() => {
                    setDeleteModalState(true)
                }}>Delete</Button>
            }


        ];



        let result = [];
        for (const key in client_.cart) {
            result.push(itemsData[key]);
        }


        return (
            <div>
                <Navbar variant="light" bg="light" expand="lg">
                    <Container fluid>
                        <Row>
                            <Col> <Navbar.Brand>Shoping cart</Navbar.Brand></Col>

                        </Row>
                    </Container>

                </Navbar>
                <MaterialTable title="Employee Details" data={result} columns={columns}/>
                <Card style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    float: "right", width: '100%'
                }}>
                    <Card.Header>Cart Totals</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item>Total : {itemsPriceSum}</ListGroup.Item>
                        <ListGroup.Item><Button>buy</Button></ListGroup.Item>
                    </ListGroup>
                </Card>


            </div>
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
                        Out Items
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
