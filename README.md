# Classe

A simple class building function for JavaScript that supports multiple inheritance.

This is primarily intended for usage in the [Cadre] AI framework, but feel free to use it elsewhere. The design is modeled off Lua's simple multiple inheritance class builders.

## Example

```JavaScript
var Animal = Class({
    init: function() {
        this.isAlive = true;
        this.says = "AK!";
    },

    talk: function() {
        console.log(this.says);
    },
});

var LovedOne = Class({
    init: function(isLoved) {
        this.isLoved = isLoved;
    },

    leave: function() {
        this.isLoved = false;
    },
});

var Dog = Class(Animal, LovedOne { // multiple inheritance!
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
```
