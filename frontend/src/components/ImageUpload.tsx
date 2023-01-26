import axios from "axios";
import "../pages/users/UserEdit.css";
import { useAppDispatch } from "../redux/hooks";
import { updateCurrentUser } from "../redux/slices/currentUserSlice";

const ImageUpload = (props: { uploaded: (url: string) => void }) => {
  const dispatch = useAppDispatch();

  const upload = async (files: FileList | null) => {
    if (files === null) return;

    const formData = new FormData();

    formData.append("image", files[0]);

    const { data } = await axios.post("upload", formData);

    props.uploaded(data.url);

    dispatch(updateCurrentUser({ avatar: data.url }));
  };

  return (
    <label className="btn btn-primary button2FA">
      Upload
      <input type="file" hidden onChange={(e) => upload(e.target.files)} />
    </label>
  );
};

export default ImageUpload;
