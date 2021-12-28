// Constructs the grid of employees given a list of the employees
const buildEmployeeGrid = (employees) => {
    for (const employee of employees) {

        const employeeRow =
            `<tr>
                <td><input id="fname${employee.id}" type="text" value="${employee.firstName}"></td>
                <td><input id="lname${employee.id}" type="text" value="${employee.lastName}"></td>
                <td><input id="hdate${employee.id}" type="date" value="${employee.hireDate}"></td>
                <td>
                    <select name="cars" id="role${employee.id}">
                      <option value="CEO">CEO</option>
                      <option value="VP">VP</option>
                      <option value="Manager">Manager</option>
                      <option value="Lackey">Lackey</option>
                    </select>
<!--                    <input id="role${employee.id}" type="text" value="${employee.role}">-->
                </td>
                <td>${employee.id}</td>
                <td><button id="deleteEmployeeButton" onclick="deleteEmployee(${employee.id})">Delete</button></td>
            </tr>`
        $(`#hdate${employee.id}`).datepicker({ dateFormat: 'yyyy-mm-dd' })
        $('#employeeTable').append(employeeRow)
    }
}

// HTTP call to retrieve all employees
const getAllEmployees = async () => {
    await $.ajax({
        type: 'GET',
        url: '/api/employees',
        success: (employees) => {
            buildEmployeeGrid(employees);
            console.log('Employees successfully retrieved')
        },
        error: (err) => {
            console.error(`Error retrieving all employees: ${err}`);
        }
    })
}
// HTTP call to delete an employee
const deleteEmployee = async (employeeId) => {
    await $.ajax({
        type: "DELETE",
        url: `/api/employees/${employeeId}`,
        data: {employeeId},
        success: () => {
            clearEmployeeTable();
            getAllEmployees();
            console.log('Employee successfully deleted')
        },
        error: (err) => {
            console.error(`Error deleting employee: ${err}`);
        }
    })
    alert(`deleting employee with id: ${employeeId}`)
}
// HTTP call to update employees
const updateEmployees = () => {
    alert("updating employees")
}
// HTTP call to create a new employee
const createEmployee = async () => {
    await $.ajax({
        type: "POST",
        url: `/api/employees/`,
        success: () => {
            clearEmployeeTable();
            getAllEmployees()
            console.log('Employee successfully created')
        },
        error: (err) => {
            console.error(`Error creating employee: ${err}`);
        }
    })
}

// Refresh the employee table when an employee is deleted, added, or edited
const clearEmployeeTable = () => {
    $("#employeeTable tr").detach();
    $("#employeeTable").append(
        `<tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Hire Date</th>
            <th>Role</th>
            <th>ID</th>
        </tr>`)
}

