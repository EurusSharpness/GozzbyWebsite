// THE FILE IS BLOODY EMPTY LAD!!
import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    Button,
    Modal
} from "react-bootstrap";


export function DeleteModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-tit    le-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Are you sure you want to delete this item?
                </Modal.Title>
                <Modal.Body>
                    <Button variant={"danger"} className={'shadow-none'} style={{textShadow: false}}
                            onClick={async () => {
                                await props.onDelete(props.currentitemid);
                                props.onHide();
                            }}>Yes</Button>
                    <Button variant={"outline-secondary"} className={'shadow-none'}
                            style={{marginLeft: 10, textShadow: false}}
                            onClick={props.onHide}>No</Button>
                </Modal.Body>
            </Modal.Header>
        </Modal>
    );
}


export function ConfirmCheckoutModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-tit    le-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Are you sure you want to checkout? total price = {props.itemsum}
                </Modal.Title>
                <Modal.Body>
                    <Button variant={"danger"} className={'shadow-none'} style={{textShadow: false}}
                            onClick={async () => {
                                await props.doconfirm();
                                props.onHide();
                            }}>Yes</Button>
                    <Button variant={"outline-secondary"} className={'shadow-none'}
                            style={{marginLeft: 10, textShadow: false}}
                            onClick={props.onHide}>No</Button>
                </Modal.Body>
            </Modal.Header>
        </Modal>
    );
}
