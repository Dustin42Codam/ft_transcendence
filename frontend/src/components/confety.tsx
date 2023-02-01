import React from 'react';
import Confetti from 'react-confetti';

export default () => {
	let w:number = window.innerWidth;
	let h:number = window.innerHeight;
  return (
    <Confetti
      width={w}
      height={h}
    />
  )
}
