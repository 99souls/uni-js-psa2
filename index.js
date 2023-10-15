// PRACTICAL SKILLS ASSESSMENT 2 - GROUP 4
// Andrew Foy (B00885906)
// Jamie McMurray (B00888445)

const rsc = require("readline-sync");
const fs = require("fs");

let studentDetails = []; // Temp array for student info
let courseDetails = {}; // Temp object for course info

// STUDENT INFORMATION CLASS
class Student {
    constructor(name, dob, gender, mode, year, modules, fee) {
        this.name = name;
        this.dob = dob;
        this.gender = gender;
        this.mode = mode;
        this.year = year;
        this.modules = modules;
        this.fee = fee;
    }
}

// COURSE INFORMATION CLASS
class Course {
    constructor(courseName, fulltimeTotal, parttimeTotal, malePercentage, femalePercentage, otherPercentage) {
        this.name = courseName;
        this.ftTotal = fulltimeTotal;
        this.ptTotal = parttimeTotal;
        this.malePercent = malePercentage;
        this.femPercent = femalePercentage;
        this.otherPercent = otherPercentage;
    }
}

// INIT HANDLER
const init = () => {
    let storedStudentDetails = fs.readFileSync("student_details.txt", "utf8");
    // checks student/course info stored on disk, if there is info stored already, updates
    if (storedStudentDetails) {
        studentDetails = JSON.parse(storedStudentDetails); // updates studentDetails
    }

    let storedCourseDetails = fs.readFileSync("course_details.txt", "utf8");
    if (storedCourseDetails) {
        courseDetails = JSON.parse(storedCourseDetails); // updates courseDetails
    }

    menu();
};

// TERMINATION HANDLER
const terminate = () => {
    // If student details empty, do nothing
    if (studentDetails != []) {
        // Checks + removes students with missing info,
        removeMissing();

        // Formats as JSON string, as you can't write objects directly to file
        let jsonStudentDetails = JSON.stringify(studentDetails);

        console.log("Terminating program. Saving details.");
        // Writes the formatted student details to appropriate text file.
        // if any errors happens, prints the error message, else prints success message.
        fs.writeFile("student_details.txt", jsonStudentDetails, (err) => {
            if (err) console.log(err);
            else console.log("Student details successfully saved.");
        });
    }

    if (courseDetails != {}) {
        let jsonCourseDetails = JSON.stringify(courseDetails);

        fs.writeFile("course_details.txt", jsonCourseDetails, (err) => {
            if (err) console.log(err);
            else console.log("Course details successfully saved.");
        });
    }
};

// MENU BUILDER
const menu = () => {
    console.log("Welcome to the Enrolment Register");
    console.log("Please select an option:");
    console.log("1. Add a new student");
    console.log("2. Remove a student");
    console.log("3. Return course details");
    console.log("4. Find a student by name");
    console.log("5. Terminate program.");
    let option = rsc.question("Select an option - ");

    switch (option) {
        case "1":
            addStudent();
            break;
        case "2":
            removeStudent();
            break;
        case "3":
            reportCourseDetails();
            break;
        case "4":
            findStudent();
            break;
        case "5":
            terminate();
            break;
        default:
            console.log("Invalid option selected.");
            menu();
    }
};

// ADD STUDENT INFORMATION
const addStudent = () => {
    // Checking if less than 20 students have been added.
    if (studentDetails.length == 20) {
        console.log("You can only add up to 20 students.");
        menu();
    } else {
        console.log("If any fields are left blank, the student's information will not be saved beyond this session.");
        let name = rsc.question("Enter name - ");
        let dob = getValidDate();
        let gender = getValidGender();
        let mode = getValidMode();
        let year = rsc.question("Enter year of study - ");
        let modules = getModuleCount();
        let fee = calculateTuition(mode, year, modules);

        // Creates studentInfo object using student class and then pushes to studentDetails array.
        let studentInfo = new Student(name, dob, gender, mode, year, modules, fee);
        studentDetails.push(studentInfo);
    }
    menu();
};

// GET + VALIDATE GENDER
const getValidGender = () => {
    const genders = ["male", "female", "other"]; // Gender options for includes func

    let inputGender = rsc.question("Enter gender (male/female/other) - ");
    inputGender = inputGender.toLowerCase(); // Standardise input to lowercase.

    let validGender = false;
    while (validGender == false) {
        // Check if inputted gender is in genders array.
        if (genders.includes(inputGender) == false) {
            console.log("Invalid gender entered, please try again.");
            inputGender = rsc.question("Enter gender (male/female/other) - ");
            inputGender = inputGender.toLowerCase(); // Standardise input to lowercase.
        } else {
            validGender = true;
            return inputGender;
        }
    }
};

// GET + VALIDATE DATE
const getValidDate = () => {
    let valid = false;
    while (valid == false) {
        inputtedDate = rsc.question("Enter date of birth (DD/MM/YYYY) - ");

        // Seperate date into day, month, year, then give each unique var
        splitDate = inputtedDate.split("/");
        let [day, month, year] = [splitDate[0], splitDate[1], splitDate[2]];

        // Checking for character length of each section
        if (day.length == 2 && month.length == 2 && year.length == 4) {
            // Convert day, month, year to int so we can validate actual values
            let [dayInt, monthInt, yearInt] = [parseInt(day), parseInt(month), parseInt(year)];
            let currentYear = new Date().getFullYear();
            if (dayInt <= 31 && monthInt <= 12 && yearInt <= currentYear) {
                valid = true;
            } else {
                console.log("Invalid date entered, please try again.");
            }
        } else {
            console.log("Invalid date format, please enter as DD/MM/YYYY");
        }
    }
    return inputtedDate;
};

// GET + VALIDATE MODE OF STUDY
const getValidMode = () => {
    const modes = ["ft", "pt", "FT", "PT"]; // Store possible options for validation
    let validMode = false;

    let inputtedMode = rsc.question("Enter mode of study (PT or FT) - ");
    while (validMode === false) {
        if (modes.includes(inputtedMode)) {
            validMode = true;
            return inputtedMode;
        } else {
            console.log("Invalid mode of study entered, please try again.");
            inputtedMode = rsc.question("Study mode (PT or FT) - ");
        }
    }
};

// GET + VALIDATE NUMBER OF MODULES
const getModuleCount = () => {
    const modules = ["1", "2", "3", "4", "5", "6"]; // Store possible options for validation

    let inputtedModules = rsc.question("Enter number of modules (1-6) - ");
    let validModules = false;
    while (validModules === false) {
        if (modules.includes(inputtedModules)) {
            validModules = true;
            return inputtedModules;
        } else {
            console.log("Invalid number of modules entered, please try again.");
            inputtedModules = rsc.question("Enter number of modules (1-6) - ");
        }
    }
};

// TUITION CALC
const calculateTuition = (mode, year, modules) => {
    // Standardise input to upper case
    if (mode.toUpperCase() == "FT") {
        // If in Year 3, fee is 2500, otherwise 5000
        if (year == "3") {
            return 2500;
        } else {
            return 5000;
        }
    } else {
        // 750 per module
        return 750 * modules;
    }
};

// REMOVE STUDENT BY NAME
const removeStudent = () => {
    let studentName = rsc.question("Enter name of student to be removed - ");

    let validStudent = false;
    studentDetails.forEach((student) => {
        if (student.name.toLowerCase == studentName.toLowerCase) {
            studentDetails = studentDetails.filter((student) => student.name.toLowerCase !== studentName.toLowerCase); // Filter out the student.
            console.log("Student removed successfully.");
        } else {
            console.log("Student does not exist.");
        }
    });
    menu();
};

// RETURN COURSE DETAILS
const reportCourseDetails = () => {
    courseName = rsc.question("Enter course name - ");
    // Get total num of students
    totalStudents = studentDetails.length;

    // total vars
    let ftTotal = 0;
    let ptTotal = 0;
    let fTotal = 0;
    let mTotal = 0;
    let oTotal = 0;

    studentDetails.forEach((student) => {
        // Total modes of study
        if (student.mode == "FT") {
            ftTotal += 1;
        } else {
            ptTotal += 1;
        }

        // Total genders
        if (student.gender == "male") {
            mTotal += 1;
        } else if (student.gender == "female") {
            fTotal += 1;
        } else {
            oTotal += 1;
        }
    });

    let malePercent = Math.round((100 * mTotal) / totalStudents); // % of males in course
    let femPercent = Math.round((100 * fTotal) / totalStudents); // % of females in course
    let otherPercent = Math.round((100 * oTotal) / totalStudents); // % of students who identify otherwise

    console.log("Course Name - " + courseName);
    console.log("Number of Full Time students - " + ftTotal);
    console.log("Number of Part Time Students - " + ptTotal);
    console.log("Percentage of male students - " + malePercent + "%");
    console.log("Percentage of female students - " + femPercent + "%");
    console.log("Percentage of students who identify otherwise - " + otherPercent + "%");

    // Create course details object using Course class
    courseDetails = new Course(courseName, ftTotal, ptTotal, malePercent, femPercent, otherPercent);

    menu();
};

// REMOVE STUDENTS WITH MISSING INFO
const removeMissing = () => {
    // Go through each student, check every property, if a property has character length of 0, remove that student.
    studentDetails.forEach((student) => {
        studentName = student.name.toLowerCase;
        for (const property in student) {
            if (property.length == 0) {
                studentDetails = studentDetails.filter((student) => student.name.toLowerCase !== studentName);
            }
        }
    });
};

// FIND STUDENT INFO BY NAME
const findStudent = () => {
    let inputName = rsc.question("Enter student name - ");
    inputName = inputName.toLowerCase; // Standardardise input
    let result;
    let studentExists = false;
    // Iterate through students, find matching property, store info.
    studentDetails.forEach((student) => {
        if (student.name.toLowerCase == inputName) {
            result = student;
            studentExists = true;
        }
    });
    if (studentExists == true) {
        console.log(
            `Name - ${result.name}\nDate of birth - ${result.dob}\nGender - ${result.gender}\nMode - ${result.mode}\nYear - ${result.year}\nNumber of modules - ${result.modules}\nTuition Fee - ${result.fee}`
        );
    } else {
        console.log("Student does not exist.");
    }

    menu();
};

init();
