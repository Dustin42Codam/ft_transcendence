import axios from "axios";
import { toast } from "react-toastify";
import "../pages/users/UserEdit.css";
import { useAppDispatch } from "../redux/hooks";
import { updateCurrentUser } from "../redux/slices/currentUserSlice";

const ImageUpload = (props: { uploaded: (url: string) => void }) => {
  const dispatch = useAppDispatch();
  
  const upload = async (files: FileList | null) => {
    if (files === null) return;

    const formData = new FormData();

    formData.append("image", files[0]);

    axios.post("upload", formData).then((response: any) => {
      dispatch(updateCurrentUser({ avatar: response.data.url }));
      props.uploaded(response.data.url);})
      .catch((err: any) => {
        toast.error(`you cannot upload this file`, {
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
  
  };

  return (
    <label className="btn btn-primary button2FA">
      Upload
      <input type="file" hidden onChange={(e) => upload(e.target.files)} />
    </label>
  );
};

export default ImageUpload;
