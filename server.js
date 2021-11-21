const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;

require("dotenv").config();

const dbcon = mysql.createConnection(
    {
        host: 'localhost',
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PW
    }
);

dbcon.connect(err => {
    if (err) {
        console.log(err)
    } else {
        console.log("Connected to employee_db")
        new tracker().start();
    }
});

class tracker {
    start(){
        inquirer.prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'selection',
            choices: [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Updated Employee Manager'
            ]
        })
    }
}