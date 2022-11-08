import React, { Component } from 'react'
import Nav from './Nav'
import Menu from './Menu'

class Wrapper extends Component {
  render() {
	return (
		<>
			<Nav />

			<div className="container-fluid">
			  <div className="row">		
						<Menu />
				<main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
					{/* {this.props.children} */}
					{/* {this.props.date} */}
				</main>
			  </div>
			</div>
		</>
	)
  }
}

export default Wrapper;
