const express = require('express');
const { v4: uuidv4 } = require('uuid');     //For generating unique ids
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const hostname = '127.0.0.1';
const port = 3000;

const app = new express();
app.use("/public", express.static('./public/'));
app.use(jsonParser);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// Per the instructions, an array of employees will be used as a DB instead
// Initialize the original 3 employees given in the instructions
let employees = [
    {
        firstName: 'Alfred',
        lastName: 'Hong',
        hireDate: '2012-12-12',
        role: 'Manager',
        id: uuidv4()
    },
    {
        firstName: 'Maria',
        lastName: 'Fuentes',
        hireDate: '2005-09-10',
        role: 'CEO',
        id: uuidv4()
    },
    {
        firstName: 'Tom',
        lastName: 'Smith',
        hireDate: '2001-03-05',
        role: 'VP',
        id: uuidv4()
    },
]

// Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/employee_table.html'));
});

// Get all employees
app.get('/api/employees', (req, res) => {
    try {
        res.status(200).send(employees);    //Return the current employee array
    }
    catch (err) {
        res.status(500).send('Error retrieving all employees');
    }
});

// Creating a new employee
app.post('/api/employees', (req, res) => {
    try {
        const newEmployee = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            hireDate: req.body.hireDate,
            role: req.body.role,
            id: uuidv4()
        }
        employees.push(newEmployee);
        res.status(200).send('Employee successfully created');
    }
    catch (err) {
        res.status(500).send('Error creating employee');
    }
});

// Updating an employee
app.put('/api/employees/:id', (req, res) => {
    try {
        const userToUpdate = req.params.id;

        const employeeIndex = employees.findIndex((obj => obj.id === userToUpdate));
        employees[employeeIndex].firstName = req.body.firstName;
        employees[employeeIndex].lastName = req.body.lastName;
        employees[employeeIndex].hireDate = req.body.hireDate;
        employees[employeeIndex].role = req.body.role;

        res.status(200).send('Updating an employee');
    }
    catch (err) {
        res.status(500).send('Error updating employee');
    }
});

// Deleting an employee
app.delete(`/api/employees/:id`, (req, res) => {
    try {
        const userToDelete = req.params.id;
        //Keep all values except for the one that needs to be removed
        employees = employees.filter((value) => {
            return value.id !== userToDelete;
        })
        res.status(200).send('Employee successfully deleted');
    }
    catch (err) {
        res.status(500).send('Error deleting employee');
    }
});