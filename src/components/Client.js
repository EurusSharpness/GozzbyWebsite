import React from 'react';
import Loading from "./Loading";
import {FirebaseAuth, users, FirebaseEmailAuthProvider} from "./firebase_functions"
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Container, Row, Col, Button} from "react-bootstrap";

import {ChangeNicknameModal, ChangePasswordModal} from "./Client_functions";

let clientData = null;


async function loadClient(u, setUserdocument) {
    if (clientData) return;
    await users.doc(u.email).get().then((client) => {
            console.log(`${u.email} data was fetched.`);
            clientData = client.data();
            setUserdocument(users.doc(u.email));
        }
    ).catch(() => console.error(`${u.email} data was not fetched successfully`));
}

/**
 * Client must have:
 * 1: Profile
 *  1.1: Change Name.
 *  1.2: Reset password.
 * 2: Logout button.
 */
export function Client(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [NicknamemodalShow, setNicknameModalShow] = React.useState(false);
    const [PasswordmodalShow, setPasswordModalShow] = React.useState(false);
    const [userdocument, setUserdocument] = React.useState(null);
    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(async u => {
            await loadClient(u, setUserdocument);
            setIsLoading(false);
        });
    }, [props.history]);
    if (isLoading) {
        return (
            <div className={'Container'}>
                Loading User Profile!!
                <Loading/>
            </div>
        );
    }

    // Show user Email
    // Add an option to change nickname
    // Add an option to reset password

    return (
        <>
            <Container>

                <Row>
                    <Col>

                    </Col>
                </Row>
                <Button variant="primary" className={'shadow-none'} onClick={() => setNicknameModalShow(true)} style={{width: "auto"}}>
                    Change Nickname
                </Button>


                <ChangeNicknameModal
                    show={NicknamemodalShow}
                    onHide={() => setNicknameModalShow(false)}
                    clientdocument={userdocument}
                />


                <Button variant="primary" className={'shadow-none'} onClick={()=>{
                    const provider = FirebaseEmailAuthProvider.credential(
                        FirebaseAuth.currentUser.email,
                        '55887744'
                    )
                    FirebaseAuth.currentUser.reauthenticateWithCredential(provider).then(()=>{
                        setPasswordModalShow(true)
                    }).catch(()=>console.log('Authentication failed'));
                }} style={{width: "auto"}}>
                    Change Password
                </Button>


                <ChangePasswordModal
                    show={PasswordmodalShow}
                    onHide={() => setPasswordModalShow(false)}
                    currentuser={FirebaseAuth.currentUser}
                    authentication
                />

            </Container>
        </>
    );
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
            {clientData ? clientData.name : ''} ggg
        </div>
    );

}
