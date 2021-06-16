import {auth, items} from "./firebase_functions";
import React from "react";

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
                result.push(new Products(product.id, product.data()));
            });
            setProducts(result);
        }
    ).catch(()=> console.log('something went wrong somewhere!'));
}

export function handleSignOut(props) {
    auth.signOut().then(() => {
        props.history.push("/");
    }).catch(error => {
        alert(error.message);
    });
}



/**
 * @param {Products} product The product to handle
 */
const handleItem = (product) => {
    return (
        <p>{product.name} {product.price} {product.brand}</p>
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

    return (
        <div>

            {modified.map((value => handleItem(value)))}
        </div>
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
