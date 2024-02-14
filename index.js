


function log(msg){
    console.log(msg)
}


log("\ntesl log")

/*
let o = new Object();
let m= new Map();

let numbers= new Array();

numbers[0] =1;
numbers[1]=" petete";

numbers.push(4);

log(numbers)


for(let i=0;i<numbers.length;i++){
    log(i+": "+numbers[i])
}



numbers.forEach(log)




numbers.forEach((n)=> log(n));


numbers.filter((n)=>{
    return n>4;
 }).forEach((n)=>log(n))



var s= numbers.reduce((a,n)=>{
    log(a+" --> "+ n);
    return a+n;
});

log(S);

let contact= new Object();

contact.name= "pepe";
contact.phone= 123456

console.log(contact)
*/

let contact2= [{name: 'luis',phone:23456},{name: 'juan',phone:23456}];


function prueba(contact2,filtro){
    
    
    return contact2.filter((n)=>n.name.match(filtro)).forEach(log);
}

prueba(contact2,"luis");



//////////////////////////////////

let cool= require("cool-ascii-faces");

//npm install cool-ascii-faces

console.log(cool());