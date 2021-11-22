const inquirer = require('inquirer');
const cTable = require('console.table');
const dbcon = require('./db/connection');

const PORT = process.env.PORT || 3001;

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
            name: 'action',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add A Department',
                'Add A Role',
                'Add Employee',
                'Update Employee Role',
            ]
        })
            .then(choice => {
                return this.selectOption(choice.action);
            })
            .catch(err => {
                console.log(err);
            });
    };

    // displayQuery(query) {
    //     con.promise().query(query)
    //     .then( ([rows,fields]) => {
    //         // console log results
    //         console.log(` ` + cTable.getTable(rows));
    //         // return back to the tracker menu
    //         this.start();
    //     })
    //     .catch(console.log)
    // };

    viewAllDept() {
        // const sql = `SELECT * FROM department`;

        // dbcon.query(sql, (err, rows) => {
        //     if(err){
        //         console.log(err);
        //     }
        //     console.table(rows);
        //     this.start();
        // })
    };

    viewAllRoles() {
        const sql = `SELECT * FROM role`;

        dbcon.query(sql, (err, rows) => {
            if(err){
                console.log(err);
            }
            console.table(rows);
            this.start();
        })
    };

    viewAllEmployees() {
        return `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee 
        LEFT JOIN role on employee.role_id = role.id 
        LEFT JOIN department on role.department_id = department.id 
        LEFT JOIN employee manager on manager.id = employee.manager_id;`,

        this.start();
    };

    addDept() {
        inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'What will the name of this department be?',
                validate: deptName => {
                    if (deptName) {
                        return true;
                    } else {
                        console.log('Name Required');
                        return false;
                    }
                }
            }
        ])
            .then((newDept) => {
                return `INSTERT INTO department SET ?`,

                this.start();
            })
            .catch(err => {
                console.log(err);
            });
    };

    addRole() {
        inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'What will the name of this role be?',
                validate: roleName => {
                    if (roleName) {
                        return true;
                    } else {
                        console.log('Name Required');
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary of this role?',
                validate: roleName => {
                    if (roleName) {
                        return true;
                    } else {
                        console.log('Salary Required');
                        return false;
                    }
                }
            },
            {
                type: 'text',
                name: 'deptartment',
                message: 'What department does this role belong to?',
                validate: roleName => {
                    if (roleName) {
                        return true;
                    } else {
                        console.log('Department Required');
                        return false;
                    }
                }
            }
        ])
            .then((newDept) => {
                return `INSTERT INTO role SET ?`,

                this.start();
            })
            .catch(err => {
                console.log(err);
            });

    };

    addEmployee() {
        inquirer.prompt([
            {
                type: 'text',
                name: 'first_name',
                message: 'What is the first name of this new employee?',
                validate: employeeName => {
                    if (employeeName) {
                        return true;
                    } else {
                        console.log('Name Required');
                        return false;
                    }
                }
            },
            {
                type: 'text',
                name: 'last_name',
                message: 'What is the last name of this new employee?',
                validate: employeeName => {
                    if (employeeName) {
                        return true;
                    } else {
                        console.log('Name Required');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'role_id',
                message: "What is this new employee's role?",
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager_id',
                message: "Who is this new employee's manager?",
                choices: managerChoices
            }
        ])
            .then((newEmployee) => {
                return `INSTERT INTO employee SET ?`,

                this.start();
            })
            .catch(err => {
                console.log(err);
            });

    };

    updateEmployeeRole(updatedRole) {
        role_id = roleList.indexOf(updatedRole.role) +1;
        employee_id = employeeList.indexOf(updatedRole.employee) +1;

        const db = `UPDATE employee
                    SET role_id = ${role_id}
                    WHERE id = ${employee_id}`;
        
        dbcon.query(db, (err, rows) => {
            if (err) {
                console.log(err);
            }
            console.log('Employee role updated');

            this.start();
        });
    };

    selectOption(action) {
        if (action == 'View All Departments') {
            this.viewAllDept();
        } else if (action == 'View All Roles') {
            this.viewAllRoles();
        } else if (action == 'View All Employees') {
            this.viewAllEmployees();
        } else if (action == 'Add A Department') {
            this.addDept();
        } else if (action == 'Add A Role') {
            this.addRole();
        } else if (action == 'Add Employee') {
            this.addEmployee();
        } else if (action == 'Update Employee Role') {
            this.updateEmployeeRole();
        } else {
            console.log('Nope')
        }
    };
};
