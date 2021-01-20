const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members, and to create objects for each team member (using the correct classes as blueprints!)
var teamMates = [];

const generic = [
    {
        type: 'list',
        name: 'role',
        message: 'What is your role?',
        choices: ['Manager', 'Engineer', 'Intern']
    },
    {
        type: 'input',
        name: 'name',
        message: 'What is your name?'
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is your ID number?'
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is your email address?'
    },
    {
        type: 'input',
        name: 'officeNumber',
        message: 'What is your office number?',
        when: answers => answers.role === 'Manager'
    },
    {
        type: 'input',
        name: 'github',
        message: 'What is your github username?',
        when: answers => answers.role === 'Engineer'
    },
    {
        type: 'input',
        name: 'school',
        message: 'What is the name of your school?',
        when: answers => answers.role === 'Intern'
    },
    {
        type: 'confirm',
        name: 'another',
        message: "Would you like to input another member of the team?"
    }
];

const promptUser =  () => {
    return inquirer.prompt(generic).then(async answers => {

        switch (answers.role) {
            case 'Manager':
                const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
                teamMates.push(manager);
                break;
            case 'Engineer':
                const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
                teamMates.push(engineer);
                break;
            case 'Intern':
                const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
                teamMates.push(intern);
                break;
        };

        if (answers.another === true) {
            await promptUser();
        }
        else {
            writeToFile();
        }
    }).catch(error => console.log(error));
};



// After the user has input all employees desired, call the `render` function (required above) and pass in an array containing all employee objects; the `render` function will generate and return a block of HTML including templated divs for each employee!

function writeToFile() {
    const page = render(teamMates);
    fs.writeFile(outputPath, page, () => {
        
        console.log("wrote successful");
    });

}

// After you have your html, you're now ready to create an HTML file using the HTML returned from the `render` function. Now write it to a file named `team.html` in the `output` folder. You can use the variable `outputPath` above target this location.

const init = async () => {
    const answers = await promptUser();
    // const page = await render(teamMates);
    // const html = await writeToFile(outputPath, page);
}

init();
// Hint: you may need to check if the `output` folder exists and create it if it does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different information; write your code to ask different questions via inquirer depending on employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer, and Intern classes should all extend from a class named Employee; see the directions for further information. Be sure to test out each class and verify it generates an object with the correct structure and methods. This structure will be crucial in order for the provided `render` function to work!
