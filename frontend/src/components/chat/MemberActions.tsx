import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./MemberActions.css";
import { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";

function MemberActions(props: any) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<MoreVertIcon onClick={handleShow}/>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>User Actions</Modal.Title>
				</Modal.Header>

				<Modal.Body>

				</Modal.Body>

				<Modal.Footer></Modal.Footer>
			</Modal>
		</>
	);
}

export default MemberActions;
