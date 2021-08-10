import {Modal, Button, InputGroup, FormControl} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

export function ChangeNicknameModal(props, setName) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Change your nickname
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <FormControl
                        id={'NicknameValue'}
                        placeholder="Your desired nickname"
                        aria-label="Your desired nickname"
                        aria-describedby="basic-addon2"
                    />

                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"primary"} className={'shadow-none'} onClick={() => {
                    props.onHide();
                    let name = document.getElementById('NicknameValue').value;
                    if (name.length === 0) return;
                    props.clientdocument.update({name: name}).then(() => {
                        console.log('Name successfully changed to ' + name + '!');
                    }).catch((() => console.log('something went wrong with updating the name!')));
                }}>Save</Button>
                <Button variant={"outline-secondary"} className={'shadow-none'} style={{textShadow: false}}
                        onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export function ChangePasswordModal(props, setName) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Change your nickname
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <FormControl
                        id={'CurrentPassword'}
                        placeholder="Current password"
                        aria-label="Current password"
                        aria-describedby="basic-addon2"
                    />

                </InputGroup>
                <InputGroup className="mb-3">
                    <FormControl
                        id={'Password'}
                        placeholder="New password"
                        aria-label="New Password"
                        aria-describedby="basic-addon2"
                    />

                </InputGroup>
                <InputGroup className="mb-3">
                    <FormControl
                        id={'ConfirmPassword'}
                        placeholder="Confirm new password"
                        aria-label="Confirm password"
                        aria-describedby="basic-addon2"
                    />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"primary"} className={'shadow-none'} onClick={() => {
                    props.onHide();
                    let password = document.getElementById('Password').value;
                    if (password.length === 0) return;
                    props.currentuser.updatePassword(password).then(() => {
                        console.log('Name successfully changed to ' + password + '!');
                    }).catch((() => console.log('something went wrong with updating the name!')));
                }}>Save</Button>
                <Button variant={"outline-secondary"} className={'shadow-none'} style={{textShadow: false}}
                        onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}