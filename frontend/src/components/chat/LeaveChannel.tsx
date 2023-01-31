import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentMember } from "../../redux/slices/currentMemberSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LeaveChannel() {
  const currentMember = useAppSelector(selectCurrentMember);
  const navigate = useNavigate();

  async function leaveChannel() {
    await axios
      .post(`member/leave/id/${currentMember.id}`)
      .then((ret) => {
        toast.success(`You left the chat!`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        navigate("/", { replace: true });
      })
      .catch((error: any) => {
        console.log(error);
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  }

  return (
    <>
      <OverlayTrigger
        key="left"
        placement="left"
        overlay={
          <Tooltip id={`tooltip-'left'`}>
            <strong>Leave Channel</strong>
          </Tooltip>
        }
      >
        <ExitToAppIcon onClick={leaveChannel} />
      </OverlayTrigger>
    </>
  );
}

export default LeaveChannel;
