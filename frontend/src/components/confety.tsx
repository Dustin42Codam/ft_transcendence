import React from "react";
import Confetti from "react-confetti";

const Confetty = () => {
  let w: number = window.innerWidth;
  let h: number = window.innerHeight;
	console.log("heigth",w, h);
  return <Confetti width={w} height={h} />;
};
export default Confetty;
