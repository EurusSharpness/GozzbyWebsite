import {FirebaseAuth, FirebaseEmailAuthProvider, items} from "./firebase_functions";
import React from "react";
import {Button, Col, FormControl, InputGroup, Modal, Row} from "react-bootstrap";

export const SortByAscending = 1;
export const SortByDescending = 2;
export const NoFilter = 'none';


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


/**
 * @param {Products} product The product to handle
 * @param {Number} uniqueKey The product key.
 */
const handleItem = (product, uniqueKey) => {
    //<button> add to cart..price$
    //left in stock
    return (
        <div className="child" key={uniqueKey}>
            <img src={product.imagePath} alt={'nice'}/>
            <p>{product.name} {product.price} {product.brand}</p>
            <Button variant="primary">Primary</Button>{' '}
        </div>
    );
};

/**
 * @param {Array<Products>} products
 * @param {number} sortBy
 * @param {string} filterBy
 */
export function getProducts(products, sortBy, filterBy) {
    let modified = products.slice(); // Copy the array.

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
    let x = 0;
    return (
        <div className="container">
            {modified.map((value => handleItem(value, x++)))}
        </div>
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
                                props.setusername(name);
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
                            if(password !== cpassword) {
                                alert('passwords do not match!');
                                return;
                            }
                            if(!strongRegex.test(password) && !mediumRegex.test(password)){
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

/*class Client {
    constructor(document, document_data) {
        this.doc = document;
        this.name = document_data.name;
        this.cart = document_data.cart;
    }

    async addItem(item_id) {
        if (this.cart == null) {
            console.log('Cannot add item, something wrong with data');
            return;
        }

        // Add new item to the cart with quantity 1 or
        // increase by 1 if already exist
        if (!this.cart.hasOwnProperty(item_id))
            this.cart[item_id] = 0;
        this.cart[item_id]++;

        // Might need to update visually as well!
        await this.doc.update({cart: this.cart}).then(() => {
            console.log('update successfully!');
        }).catch((error) => {
            console.log('error with update! ' + error);
        });
    };

    getCartDataInListForm() {
        // Ayham this is yours
        const handleItem = (itemID) => {
            return <li key={itemID}>id: {itemID}, quantity {this.cart[itemID]}</li>
        }
        return (
            <div>
                <p> User Cart</p>
                <ul>
                    {Object.keys(this.cart).map((item) => handleItem(item))}
                </ul>
            </div>
        );
    };
}*/
