import {FirebaseAuth, FirebaseEmailAuthProvider, items} from "./firebase_functions";
import React from "react";
import {Button,  Col, FormControl, InputGroup, Modal, Row} from "react-bootstrap";
import { Container} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; import
    'bootstrap-css-only/css/bootstrap.min.css'; import
    'mdbreact/dist/css/mdb.css';
import {MDBBtn, MDBCard, MDBCardBody, MDBCardFooter, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";



export const SortByAscending = 1;
export const SortByDescending = 2;
export const NoFilter = 'none';

/**
 * @type {ClientClass}
 */
let Client = null;

export class Products {
    /**
     *
     * @param {number} item_id
     * @param {{
     *     name: string, imagePath: string, price: number, quantity: number, brand: string, description: string
     * }} item_data
     */
    constructor(item_id, item_data) {
        this.name = item_data.name;
        this.id = item_id;
        this.imagePath = item_data.imagePath;
        this.price = item_data.price;
        this.quantity = item_data.quantity;
        this.brand = item_data.brand;
        this.description = item_data.description;
    }
}


export async function handleSignIn(setProducts) {
    await items.get().then((products) => {
            let result = [];
            products.docs.forEach((product) => {
                result.push(new Products(Number(product.id), product.data()));
            });
            setProducts(result);
        }
    ).catch(() => console.log('something went wrong somewhere!'));
}

export function handleSignOut(props) {
    FirebaseAuth.signOut().then(() => {
        props.history.push("/");
    }).catch(error => {
        alert(error.message);
    });
}


/**+
 * @param {Products} product The product to handle
 */
const handleItem = (product) => {
    //<button> add to cart..price$
    //left in stock

    return (

        <div style={{paddingTop:"50px",paddingBottom:"50px"}} className="col-md-4 mb-4 d-flex align-items-stretch">
            <MDBCard  alignment="center">
                <MDBCardImage src={product.imagePath} alt='...' position='top' />
                <br/>

                <div style={{backgroundColor:"lightgray"}}>
                <MDBCardTitle >{product.price} $</MDBCardTitle>
                </div>
                <MDBCardBody>
                    <MDBCardTitle>{product.name}</MDBCardTitle>
                    <MDBCardText>
                        {product.description}
                    </MDBCardText>
                </MDBCardBody>
                <MDBCardFooter>
                    <small className='text-muted'> <MDBBtn  outline rounded className='mx-lg-n2'  color='dark'>
                        Dark
                    </MDBBtn>
                    </small>
                </MDBCardFooter>
            </MDBCard>

        </div>

    );
};
//onClick={async()=> await Client.addItem(product.id)}

/**
 * @param {Array<Products>} products
 * @param {number} sortBy
 * @param {string} filterBy
 */
export function getProducts(products, sortBy, filterBy, client_) {
    Client = client_;
    let modified = products.slice(); // Copy the array.
    console.log('Sorting by: ' + sortBy);
    console.log('Filter by: ' + filterBy);

    // Sort the array according to the Sorting value...
    if (sortBy === SortByAscending) {
        modified = products.sort((a, b) => {
            return a.price - b.price;
        });
    } else if (sortBy === SortByDescending) {
        modified = products.sort((a, b) => {
            return b.price - a.price;
        });
    }
    // Sort Filter by brand...
    if (filterBy !== NoFilter) {
        modified = products.filter((value => value.brand === filterBy));
    }
    console.log(modified);
    return (
        <Container>
            {modified.map((value => handleItem(value)))}
        </Container>
    );
}


export function UserModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-tit    le-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Welcome to your profile settings!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <FormControl
                                id={'NicknameValue'}
                                placeholder="New Nickname"
                                aria-label="New Nickname"
                                aria-describedby="basic-addon2"
                                type={'text'}
                            />
                        </InputGroup>
                        <Button variant={"primary"} className={'shadow-none'} onClick={async () => {
                            props.onHide();
                            let name = document.getElementById('NicknameValue').value;
                            if (name.length === 0) return;
                            await props.clientdocument.update({name: name}).then(() => {
                                console.log('Name successfully changed to ' + name + '!');
                                props.onNameSet(name);
                            }).catch((() => console.log('something went wrong with updating the name!')));
                        }}>Save</Button>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <FormControl
                                id={'CurrentPassword'}
                                placeholder="Current password"
                                aria-label="Current password"
                                aria-describedby="basic-addon2"
                                type={'password'}
                            />

                        </InputGroup>
                        <InputGroup className="mb-3">
                            <FormControl
                                id={'Password'}
                                placeholder="New password"
                                aria-label="New Password"
                                aria-describedby="basic-addon2"
                                type={'password'}
                            />

                        </InputGroup>
                        <InputGroup className="mb-3">
                            <FormControl
                                id={'ConfirmPassword'}
                                placeholder="Confirm new password"
                                aria-label="Confirm password"
                                aria-describedby="basic-addon2"
                                type={'password'}
                            />
                        </InputGroup>
                        <p style={{color: "yellowgreen"}}>
                            * Password must contain:
                            1 upper case letter, 1 lower case, 1 number, password length must be at least 6.
                        </p>
                        <Button variant={"primary"} className={'shadow-none'} onClick={async () => {
                            const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
                            const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
                            let password = document.getElementById('Password').value;
                            let cpassword = document.getElementById('ConfirmPassword').value;
                            let oldPassword = document.getElementById('CurrentPassword').value;
                            if (password.length === 0) return;
                            if (password !== cpassword) {
                                alert('passwords do not match!');
                                return;
                            }
                            if (!strongRegex.test(password) && !mediumRegex.test(password)) {
                                alert('your password is not strong enough! follow the rules');
                                return;
                            }

                            const provider = FirebaseEmailAuthProvider.credential(
                                FirebaseAuth.currentUser.email,
                                oldPassword
                            )
                            await FirebaseAuth.currentUser.reauthenticateWithCredential(provider).then(async () => {
                                await props.currentuser.updatePassword(password).then(() => {
                                    console.log('Password successfully changed to ' + password + '!');
                                    props.onHide();
                                }).catch((() => console.log('something went wrong with updating the name!')));
                            }).catch(() => {
                                console.log('Authentication failed');
                                alert('password is not strong enough');
                            });

                        }}>Save</Button>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>

                <Button variant={"outline-secondary"} className={'shadow-none'} style={{textShadow: false}}
                        onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

