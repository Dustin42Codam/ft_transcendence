import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function MyModal() {
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    console.log("Modal rendered.");
  }, []);

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Open Modal
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>My Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Selected item: <b>{selectedItem ? selectedItem : "None"}</b>
          </p>
          <Button onClick={() => setSelectedItem("Item 1")}>
            Select Item 1
          </Button>{" "}
          <Button onClick={() => setSelectedItem("Item 2")}>
            Select Item 2
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MyModal;
