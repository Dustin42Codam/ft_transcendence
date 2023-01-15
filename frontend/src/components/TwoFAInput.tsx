import React from 'react'
import ReactCodeInput from 'react-code-input'
import PinInput from 'react-pin-input'

function TwoFAInput() {
  return (
	<div>
		{/* <PinInput length={5} focus inputMode="text" /> */}
		<ReactCodeInput type='number' fields={6} name="pin" inputMode='numeric' />
	</div>
  )
}

export default TwoFAInput