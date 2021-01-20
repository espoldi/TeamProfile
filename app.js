const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

var teamMates = [];

const questList = [
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
        message: 'What is your ID number?',
        validate: (value) => {
            let pass = value.match(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
            if (pass) { return true; }
            return 'Please enter a valid employee ID number.';
        }
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is your email address?',
    },
    {
        type: 'input',
        name: 'officeNumber',
        message: 'What is your office number?',
        when: answers => answers.role === 'Manager',
        validate: (value) => {
            let pass = value.match(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
            if (pass) { return true; }
            return 'Please enter a valid office number.';
        }
    },
    {
        type: 'input',
        name: 'github',
        message: 'What is your github username?',
        when: answers => answers.role === 'Engineer',
    },
    {
        type: 'input',
        name: 'school',
        message: 'What is the name of your school?',
        when: answers => answers.role === 'Intern',
    },
    {
        type: 'confirm',
        name: 'another',
        message: "Would you like to input another member of the team?"
    }
];

const promptUser = () => {
    return inquirer.prompt(questList).then(async answers => {

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


function writeToFile() {
    const page = render(teamMates);
    fs.writeFile(outputPath, page, () => {
        console.log("wrote successful");
    });

}

const init = async () => {
    const answers = await promptUser();
}

init();