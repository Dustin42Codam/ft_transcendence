import React from "react";
import { toast } from "react-toastify";
// #delete
function ToastError(props: { msg: any }) {
  toast.error(props.msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

  return (
    <div>
      {toast.error(props.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })}
    </div>
  );
}

export default ToastError;
