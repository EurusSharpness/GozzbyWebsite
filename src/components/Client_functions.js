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
/**
 * @param {Products} product The product to handle
 */
const handleItem = (product) => {
    //<button> add to cart..price$
    //left in stock
    return (
        <ListGroup.Item variant={''} style={{width: "60%"}}>
            <Row>
                <Col className={'col-sm-6'} sn={"auto"}>
                    <Image src={'products/1.png'} fluid={true}/>
                </Col>
                <Col className={'col-sm-6'} sm={"auto"}>
                    <Row>
                        <p style={{fontFamily: " Zapf-Chancery", fontSize: "200%"}}>{product.name}</p>
                    </Row>
                    <Row>
                        <p style={{fontFamily: " Zapf-Chancery", fontSize: "200%"}}>${product.price}</p>
                    </Row>
                    <Row>

                        <InputGroup>
                            <div style={{alignItems: "center", width: '100%'}}>
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
                                    <Input id={'quantityNumber' + product.id} placeholder="Amount" min={0} max={100}
                                           type="number" step="1"
                                           style={
                                               {
                                                   fontFamily: " Zapf-Chancery",
                                                   fontSize: '100%'
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
                                        fRender(!x);
                                        x = !x;
                                    }}>Delete</Button></Col>
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
            <Card style={{width: 'auto'}}>
                {result}
            </Card>
        </div>
    );
}