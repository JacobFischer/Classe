/**
 * @function Classe: a simple class building interface. Pass to it parent classes (built with Classe()) then a dictionary of functions. This will assign all to the new classe's prototype object, and return that new class so you can instantiate it like normal javascarip "classes" with var a = new A()
 */
var Classe = function(/*parentClasse1, parentClasse2, ..., parentClasseN, newClassePrototype*/) {
    var prototype = arguments[arguments.length - 1];

    if(prototype === undefined || Classe.isClasse(prototype)) {
        prototype = {};
    }

    var parentClassees = [];
    for(var i = 0; i < arguments.length; i++) {
        var parentClasse = arguments[i];
        if(Classe.isClasse(parentClasse)) {
            parentClassees.push(parentClasse);
        }
    }

    var newClasse = function() {
        this.__proto__.init.apply(this, arguments); // arguments of the newClasse function, not of this Classe() function
    };

    // copy all the functions from the parent class(es) to the new class's prototype, if two parents share the same function the first parent listed will be the one that the new child class's method defaults to
    for(var i = 0; i < parentClassees.length; i++) {
        var parentClasse = parentClassees[i];
        for(var property in parentClasse.prototype) {
            if(!prototype.hasOwnProperty(property)) {
                prototype[property] = parentClasse.prototype[property];
            }
        }
    }

    prototype.init = prototype.init || function() {};
    prototype._isClasse = true;
    prototype._classe = newClasse;
    prototype._parentClassees = parentClassees;
    newClasse.prototype = prototype;

    for(var property in prototype) { // also assign the properties of the prototype to this class so we can call super methods via SuperClasse.SuperFunction.call(this, ...);
        newClasse[property] = prototype[property];
    }

    // this creates an instance of newClasse, but does NOT call the init() fuction. it is expected you plan to call this later
    // simply put, creates an object with the prototype set to this newClasse
    newClasse.uninitialized = function() {
        return Object.create(prototype);
    };

    newClasse.isInstance = function(obj) {
        return Classe.isInstance(obj, newClasse);
    };

    return newClasse;
}

/**
 * Tests if the passed in variable is a class built with the above Classe method
 *
 * @param {*} classe - can be any type, but to return true it will need to be a class created with the above Classe method
 * @returns {boolean} represents if the passed in variable is a class constructor made with the Classe method
 */
Classe.isClasse = function(classe) {
    return (typeof(classe) === 'function' && classe._isClasse);
};

/**
 * In case you think Classe is a stupid word
 *
 * @see Classe.isClasse
 */
Classe.isClass = Classe.isClasse;

/**
 * checks if a passed in variable is an instance of a Classe (or that class's parent Classees)
 *
 * @param {Object} obj - object to check if it is an instance of isClasse
 * @param {function} [isClasse] - constructor made with Classe method to check if the passed in object is an instance of, or an instance of one of it's parent classes. If not passed in then just checks if obj is a class made instance
 * @returns {boolean} true if the obj is an instance of Classe, false otherwise
 */
Classe.isInstance = function(obj, isClasse) {
    if(obj === null || typeof(obj) !== "object" || !obj._isClasse) {
        return false;
    }

    if(isClasse === undefined && obj._isClasse) {
        return true;
    }

    var classes = [ obj._classe ];
    while(classes.length > 0) {
        var theClasse = classes.pop();

        if(theClasse === isClasse) {
            return true;
        }

        for(var i = 0; i < theClasse._parentClassees.length; i++) {
            classes.push(theClasse._parentClassees[i]);
        }
    }

    return false;
};

module.exports = Classe;

/** @example

var Animal = Classe({
    init: function() {
        this.isAlive = true;
        this.says = "AK!";
    },

    talk: function() {
        console.log(this.says);
    },
});

var LovedOne = Classe({
    init: function(isLoved) {
        this.isLoved = isLoved;
    },

    leave: function() {
        this.isLoved = false;
    },
});

var Dog = Classe(Animal, LovedOne { // multiple inheritance!
    init: function(breed) {
        Animal.init.call(this);            // calls the Animal class's super method init, passing to this instance to be 'this' in that function
        LovedOne.init.call(this, true);    // calls the LovedOne class's super method init, passing this to be 'this', and 'true' to be the argument for 'isLoved'

        this.says = "bark!";
        this.breed = breed;
    },

    wagTail: function() {
        console.log("the dog of breed " + this.breed + " wags it's tail!");
    },
});

// usage:

var gecko = new Animal();
var exGirlfriend = new LovedOne(false);
var pug = new Dog("pug");

gecko.talk();    // prints "AK!"
pug.talk();        // prints "bark!"

pug.wagTail();    // prints "the dog of breed pug wags it's tail!"

gecko.wagTail(); // breaks, Animal class does not have wagTail()

if(pug.isLoved) {
    console.log("I love my pug!"); // works because all dogs are loved, because the Dog class passes in true to it's LovedOne.init function
}

if(exGirlfriend.isLoved) { // exGirlfriend is not loved because we passed in 'false' to its constructor
    exGirlfriend.leave();
}

*/
