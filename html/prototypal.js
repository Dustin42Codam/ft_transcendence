
// functions are also objects

/**
 * Execution process in prototypal inheritance:
 * 1.	Base class
 * 2.	this prototype class
 * 3.	parents prototype class
 */

function Bear(type) {
	this.type = type	
}

Bear.prototype.growl = function() {
	console.log(this.type, 'growls')
}

function Grizzly() {
	Bear.call(this, 'grizzly')
}
Grizzly.prototype = Object.create(Bear.prototype)
Grizzly.prototype.growl = function () {
	console.log('override prototype')
}

var grizzly = new Grizzly()
var polar = new Bear('polar')

// grizzly.growl()
// polar.growl()

// console.log(grizzly.type, polar.type)
grizzly.growl = function() {
	console.log('override')
}
console.log(grizzly.growl())
