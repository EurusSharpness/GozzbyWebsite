import React from 'react';
import Loading from "./Loading";
import {FirebaseAuth, users, items, ClientClass} from "./firebase_functions"
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {DeleteModal} from "./Client_functions";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {Products} from "./Store_functions";
import {Input} from "reactstrap";
import {InputLabel} from "@material-ui/core";

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
    const [itemsData, setItemsData] = useState(null);
    const [client_, setClientClass] = React.useState(null);
    const [deleteModalState, setDeleteModalState] = React.useState(false);
    const [currentItemID, setcurrentItemID] = React.useState(-1);
    const [currentItemQuantity,] = React.useState([]);

    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(async u => {
            await loadClient(u, setItemsData, setClientClass);
            if(!client_) return;
            if(isLoading)
                for (let key in client_.cart)
                    currentItemQuantity[key] = client_.cart[key];
            setIsLoading(false);
        })
    }, [client_, currentItemQuantity, isLoading, props.history]);


    const getClientCart = () => {
        /**
         * @param {Products} product
         */
        const handleItem = (product) => {
            return (
                <Col>
                    <div style={{marginTop: '5%'}}>
                        <Card>
                            <Card.Img variant={"top"} src={'products/1.png'}/>
                            <Card.Title>
                                {product.name}
                            </Card.Title>
                            <Card.Body>
                                <Row>
                                    <Col sm={4}>
                                        <InputLabel style={{fontSize: '25px'}}>Quantity</InputLabel>
                                    </Col>
                                    <Col sm={6}>
                                        <Input value={currentItemQuantity[product.id]} onChange={(e) => {
                                            currentItemQuantity[product.id] = e.target.value;
                                        }}
                                        onBlur={async (e)=>{
                                            let val = Number(e.target.value);
                                            if(e.target.value.length === 0)
                                                val = 1;
                                            if(isNaN(val))
                                                val = 1;
                                            if(val > 50)
                                                val = 50;
                                            if(val < 1)
                                                val = 1;
                                            currentItemQuantity[product.id] = val;
                                            await client_.changeItemQuantity(product.id, val);
                                        }}>
                                        </Input>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={2}>
                                        <Button variant={"danger"} style={{marginLeft: "auto"}}
                                                className={'shadow-none'}
                                                onClick={() => {
                                                    setDeleteModalState(true);
                                                    setcurrentItemID(product.id);
                                                }}>Delete</Button>
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            );
        };
        let result = [];
        for (let key in client_.cart) {
            result.push(handleItem(itemsData[key]))
        }
        return (
            <Row sm={2} lg={4}>
                {result}
            </Row>
        );
    };

    const handleItemDelete = async (itemID) => {
        await client_.deleteItem(itemID);
    }

    if (isLoading) {
        return (
            <div className={'Container'}>
                Loading Cart!!
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
            </Container>
        </div>
    );

}
