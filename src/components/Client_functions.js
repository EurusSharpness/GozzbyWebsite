// THE FILE IS BLOODY EMPTY LAD!!
import React from "react";
import {Button, Card, Col, Image, ListGroup, Row, InputGroup} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Input, Label} from "reactstrap";

/**
 *
 * @type {ClientClass}
 */
let Client = null;
let fRender = null;
let x = false;


function forceRender() {
    fRender(!x);
    x = !x;
}

/**
 * @param {Products} product The product to handle
 */
const handleItem = (product) => {

    return (
        <ListGroup.Item  itemID={'productsItem' + product.id} id={'ItemInList' + product.id} variant={''}
                        style={{width: "100%"}}>
            <Row>
                <Col className={'col-sm-6'} sn={"auto"}>
                    <Image key={'productImage'+product.id} src={'products/1.png'} fluid={true}/>
                </Col>
                <Col className={'col-sm-6'} sm={"auto"}>
                    <Row>
                        <p key={'ffff'+product.id} style={{fontFamily: " Zapf-Chancery", fontSize: "200%"}}>{product.name}</p>
                    </Row>
                    <Row>
                        <p style={{fontFamily: " Zapf-Chancery", fontSize: "200%"}}>${product.price}</p>
                    </Row>
                    <Row>

                        <InputGroup>
                            <div key={'dododo'+product.id} style={{alignItems: "center", width: '100%'}}>
                                {/*<p style={{fontFamily: " Zapf-Chancery", fontSize: "200%", width: 'auto', float: 'left'}}>Quantity: </p>*/}
                                <Col className={'col-2'}>
                                    <Label for={'quantityNumber' + product.id} style={{
                                        fontFamily: " Zapf-Chancery",
                                        fontSize: '200%',
                                        display: 'inline-block',
                                        width: 'auto',
                                        textAlign: 'right'
                                    }}>Quantity:</Label>
                                </Col>
                                <Col className={'col-10'}>
                                    <Input id={'quantityNumber' + product.id} placeholder="Amount: 1"
                                           type="tel"
                                           style={
                                               {
                                                   fontFamily: " Zapf-Chancery",
                                                   fontSize: '100%'
                                               }}
                                           onBlur={async () => {
                                               let temp = document.getElementById('quantityNumber' + product.id).value;

                                               if (temp.length === 0) return;
                                               let val = Number(temp);
                                               if (isNaN(val))
                                                   val = 1;
                                               if (val > 50)
                                                   val = 50;
                                               if (val < 1)
                                                   val = 1;
                                               document.getElementById('quantityNumber' + product.id).value = val;
                                               await Client.changeItemQuantity(product.id, val);
                                               forceRender();
                                               // console.log(document.getElementById('quantityNumber'+product.id).value);
                                           }}

                                    />
                                </Col>
                            </div>
                        </InputGroup>
                    </Row>
                    <Row>
                        <Col className={'col-sm-8'}/>
                        <Col className={'col-sm-2'}>
                            <Button variant={"danger"} className={'shadow-none'}
                                    style={{width: "auto", marginTop: '10px'}}
                                    onClick={async () => {
                                        await Client.deleteItem(product.id);
                                        forceRender();
                                    }}>Delete
                            </Button>
                        </Col>
                        <Col className={'col-sm-2'}/>
                    </Row>
                </Col>
            </Row>
        </ListGroup.Item>
    );
};


/**
 * @param {Array<Products>} products
 * @param {ClientClass} client_
 * @param forceRender function to re-render the page after update.
 */
export function getProducts(products, client_, forceRender) {

    Client = client_;
    fRender = forceRender;
    let result = [];
    for (let key in Client.cart) {
        result.push(handleItem(products[key]));
    }

    return (
        <div style={{marginLeft: 0, alignContent: 'start', alignItems: 'start'}}>
            <Card style={{width: '70%'}}>
                {result}
            </Card>
        </div>
    );
}