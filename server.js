const path = require('path');
const express = require('express')
const app = express();
app.set('view engine', 'pug')

app.use( express.json() );
app.use( express.static( path.join(__dirname, '/public') ) );
app.use(  express.urlencoded( { extended: true } ) );


let people = [
    {firstname:'Tea', lastname:'Chagua', fathername:'Tamaz', personid:'12345', birthdate:'31.08.1991'},
    {firstname:'Gela', lastname:'Doe', fathername:'Nodari', personid:'7890', birthdate:'11.06.1992'},
    {firstname:'Ann', lastname:'Smith', fathername:'Matt', personid:'6785', birthdate:'19.01.1981'}
];
let cars = [
    {make: "BMW", model: "503", VIN:"1293N45XAS", license:"BB-12-GG", color:"metallic", owner:"12345"},
    {make: "Lexus", model: "LS 400", VIN:"9012NSPO45", license:"AA-00-FR", color:"blue", owner:"12345"},
    {make: "Honda", model: "Accord", VIN:"20M7N4FM78", license:"GO-88-GO", color:"red", owner:"6785"},
]

app.get('/', (req, res) => {
    res.sendFile( path.join(__dirname, '/public', 'index.html') );
})
app.post('/addPeople', (req, res)=> {
    const {firstname, lastname, fathername, personid, birthdate}  = req.body
    if(!people.find(p => p.personid === personid)){
        people.push({firstname, lastname, fathername, personid, birthdate})
        res.redirect('/')
    }else{
        res.send(`<h3>Oops! User with this ID already exists!</h3> <br> <a href='/'>Go back to the main page.</a> `)
    }
})

app.post('/byName', (req, res) => {
    let personName = req.body.fullname;
    let person = people.find(p => `${p.firstname} ${p.lastname}` === personName)
    if(person===undefined){
        res.send(`<h3>Oops, 404! User ${personName} not found.</h3> <br> <a href='/'>Go back to the main page.</a> `)
    }else if(person.disabled){
        res.send(`<h3>User ${personName} is disabled.</h3> <br> <a href='/'>Go back to the main page.</a> `)
    }else if(!person.disabled){
        res.render('person.pug', {person, cars})
    }
})
app.post('/byId', (req, res) => {
    let personId = req.body.id;
    let person = people.find(p => p.personid === personId)
    if(person===undefined){
        res.send(`<h3>Oops, 404! User with ID ${personId} not found.</h3> <br> <a href='/'>Go back to the main page.</a> `)
    }else if(person.disabled){
        res.send(`<h3>User with ID ${personId} is disabled.</h3> <br> <a href='/'>Go back to the main page.</a> `)
    }else if(!person.disabled){
        res.render('person.pug', {person, cars})
    }
})
app.get('/allUsers', (req, res) => {
    res.render('users.pug', {people})
})
app.get('/editUser/:id', (req, res) => {
    let personId = req.params.id;
    let person = people.find(p => p.personid == personId)
    res.render('editting.pug', {person})
})
app.post('/editUser/:id', (req, res) => {
    let personId = req.params.id;
    let person = people.find(p => p.personid == personId)
    let idx = people.indexOf(person); 
    people.splice(idx, 1);
    const {firstname, lastname, fathername, personid, birthdate}  = req.body
    people.push({firstname, lastname, fathername, personid, birthdate})
    res.send(`<h3>User has been successfully edited.</h3> <br> <a href='/'>Go back to the main page.</a> `)
})
app.get('/disableUser/:id', (req, res) => {
    let personId = req.params.id;
    let person = people.find(p => p.personid == personId)
    person.disabled = true
    res.render('users.pug', {people})
})
app.get('/enableUser/:id', (req, res) => {
    let personId = req.params.id;
    let person = people.find(p => p.personid == personId)
    person.disabled = false
    res.render('users.pug', {people})
})
app.get('/allCars', (req, res) => {
    res.render('cars.pug', {cars})
})
app.post('/addCars', (req, res)=> {
    const {make, model, VIN, license, color, owner}  = req.body
    if(!cars.find(c => c.VIN === VIN) && !cars.find(c => c.license === license)){
        cars.push({make, model, VIN, license, color, owner})
        res.redirect('/')
    }else{
        res.send(`<h3>Oops! Car with this identification number already exists!</h3> <br> <a href='/'>Go back to the main page.</a> `)
    }
})
app.post('/byVIN', (req, res) => {
    let carVIN = req.body.VIN;
    let car = cars.find(c => c.VIN === carVIN)
    if(car === undefined){
        res.send(`<h3>Oops, 404! Car with VIN number ${carVIN} not found.</h3> <br> <a href='/'>Go back to the main page.</a> `)
    }else if(car.disabled){
        res.send(`<h3>Car with VIN number ${carVIN} is disabled.</h3> <br> <a href='/'>Go back to the main page.</a> `)
    }else if(!car.disabled){
        res.render('car.pug', {car, people})
    }
})
app.post('/byLicense', (req, res) => {
    let carLicense = req.body.license;
    let car = cars.find(c => c.license === carLicense)
    if(car === undefined){
        res.send(`<h3>Oops, 404! Car with license number ${carLicense} not found.</h3> <br> <a href='/'>Go back to the main page.</a> `)
    }
    else if(car.disabled){
        res.send(`<h3>Car with license number ${carLicense} is disabled.</h3> <br> <a href='/'>Go back to the main page.</a> `)
    }else if(!car.disabled){
        res.render('car.pug', {car, people})
    } 
})
app.get('/editCar/:VIN', (req, res) => {
    let carVIN = req.params.VIN;
    let car = cars.find(c => c.VIN == carVIN)
    res.render('editCar.pug', {car})
})
app.post('/editCar/:VIN', (req, res) => {
    let carVIN = req.params.VIN;
    let car = cars.find(c => c.VIN == carVIN)
    let idx = cars.indexOf(car); 
    cars.splice(idx, 1);
    const {make, model, VIN, license, color, owner}  = req.body
    cars.push({make, model, VIN, license, color, owner})
    res.send(`<h3>Car has been successfully edited.</h3> <br> <a href='/'>Go back to the main page.</a> `)
})
app.get('/disableCar/:VIN', (req, res) => {
    let carVIN = req.params.VIN;
    let car = cars.find(c => c.VIN == carVIN);
    car.disabled = true;
    res.render('cars.pug', {cars});
})
app.get('/enableCar/:VIN', (req, res) => {
    let carVIN = req.params.VIN;
    let car = cars.find(c => c.VIN == carVIN);
    car.disabled = false;
    res.render('cars.pug', {cars});
})
app.listen(5000)