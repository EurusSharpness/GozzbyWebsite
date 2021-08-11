import React from 'react';
import Loading from "./Loading";
import {FirebaseAuth, users} from "./firebase_functions"
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';

let clientData = null;
async function loadClient(u, setUserdocument) {
    if(clientData) return;
    await users.doc(u.email).get().then((client) => {
            console.log(`${u.email} data was fetched.`);
            clientData = client.data();
            setUserdocument(users.doc(u.email));
        }
    ).catch(() => console.error(`${u.email} data was not fetched successfully`));
}


export function ClientCart(props) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(async u => {
            await loadClient(u);
            setIsLoading(false);
        })
    }, [props.history]);


    if (isLoading) {
        return (
            <div className={'Container'}>
                Loading Cart!!
                <Loading/>
            </div>
        );
    }
    return (
        <div className={'Container'}>

        </div>
    );

}
