#!/usr/bin/env node
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employeeQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'Please enter employee name'
    },
    {
        type: 'input',
        name: 'id',
        message: 'Please enter employee id'
    },
    {
        type: 'input',
        name: 'email',
        message: 'Please enter employee email'
    },
];
const managerQuestions = [
    ...employeeQuestions,
    {
        type: 'input',
        name: 'officeNumber',
        message: 'Please enter manager office number'
    }
]
const engineerQuestions = [
    ...employeeQuestions,
    {
        type: 'input',
        name: 'github',
        message: 'Please enter engineer\'s github username'
    }
]
const internQuestions = [
    ...employeeQuestions,
    {
        type: 'input',
        name: 'school',
        message: 'Please enter intern\'s school'
    }
]

function internPrompts() {
    return inquirer.prompt(internQuestions);
}

function managerPrompts() {
    return inquirer.prompt(managerQuestions);
}

function engineerPrompts() {
    return inquirer.prompt(engineerQuestions);
}

function start() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employeeType',
            message: 'Choose and employee type',
            choices: [
                'Manager',
                'Engineer',
                'Intern'
            ]
        }
    ])
}
const employees = []
async function init() {
    const { employeeType } = await start()

    if (employeeType === 'Engineer') {
        const { id, email, name, github } = await engineerPrompts();
        const engineer = new Engineer(name, id, email, github)
        employees.push(engineer);
    }

    if (employeeType === 'Manager') {
        const { name, id, email, officeNumber } = await managerPrompts();
        const manager = new Manager(name, id, email, officeNumber)
        employees.push(manager)
    }

    if (employeeType === 'Intern') {
        const { name, id, email, school } = await internPrompts();
        const intern = new Intern(name, id, email, school)
        employees.push(intern)
    }


    const { proceed } = await inquirer.prompt([{
        type: 'confirm',
        name: 'proceed',
        message: 'Would you like to keep adding employees?'
    }])

    if (proceed) {
        init()
    } else {
        const html = render(employees)
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR)
        }
        await writeFile(outputPath, html);

        console.log('\n\nHTML file generated at ', outputPath)
    }
}
init()



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
