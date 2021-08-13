import React from 'react';
import Loading from "./Loading";
import {FirebaseAuth, users, items, ClientClass} from "./firebase_functions"
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {getProducts} from "./Client_functions";
import {Container} from "react-bootstrap";
import {Products} from "./Store_functions";

/**
 * @param {firebase.User} u
 * @param setClientData
 * @param setItemsData
 * @param setClientClass
 */
async function loadClient(u, setClientData, setItemsData, setClientClass) {
    await users.doc(u.email).get().then(async (client) => {
            console.log(`${u.email} data was fetched.`);
            let data = client.data();
            setClientData(data);
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
    ).catch((error) => console.error(`${u.email} data was not fetched successfully Error code = ` + error));
}


export function ClientCart(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [clientData, setClientData] = useState(null);
    const [itemsData, setItemsData] = useState(null);
    const [client_, setClientClass] = React.useState(null);
    const [, setJoke] = React.useState(false);
    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(async u => {
            await loadClient(u, setClientData, setItemsData, setClientClass);
            setIsLoading(false);
        })
    }, [props.history]);

    /*if(clientData === null){
        setIsLoading(true);
        loadClient(FirebaseAuth.currentUser).then(()=>setIsLoading(false));
    }*/

    if (isLoading) {
        return (
            <div className={'Container'}>
                Loading Cart!!
                <Loading/>
            </div>
        );
    }

    return (
        <div style={{paddingTop: '5%'}}>
            <Container fluid={true} className={''}>
                {clientData ? getProducts(itemsData, client_, setJoke) : ''}
            </Container>
        </div>
    );

}
