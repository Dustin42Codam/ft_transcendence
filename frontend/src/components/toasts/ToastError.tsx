import React from "react";
import { toast } from "react-toastify";
// #delete
function toastError(msg: string) {
  toast.error(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}

export default toastError;
