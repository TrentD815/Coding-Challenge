// Constructs the grid of employees given a list of the employees
const buildEmployeeGrid = (employees) => {
    for (const employee of employees) {
        const employeeRow =
            `<tr>
                <td><input id="fname${employee.id}" type="text" value="${employee.firstName}" required></td>
                <td><input id="lname${employee.id}" type="text" value="${employee.lastName}" required></td>
                <td><input id="hdate${employee.id}" type="date" value="${employee.hireDate}" required></td>
                <td>
                    <select id="role${employee.id}">
                      <option value="" selected disabled hidden>${employee.role}</option>
                      <option value="CEO">CEO</option>
                      <option value="VP">VP</option>
                      <option value="Manager">Manager</option>
                      <option value="Lackey">Lackey</option>
                    </select>
                </td>
                <td>${employee.id}</td>
                <td><button type="button" id="deleteEmployeeButton" onclick="deleteEmployee('${employee.id}')">Delete</button></td>
                <td><button id="updateEmployeeButton" onclick="updateEmployee('${employee.id}')">Edit Employee</button></td>
            </tr>`
        $(`#hdate${employee.id}`).datepicker({ dateFormat: 'yyyy-mm-dd' })     //Not sure why this doesn't work
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
            //console.log('Employees successfully retrieved')
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
        success: async () => {
            clearEmployeeTable();
            await getAllEmployees();
            //console.log('Employee successfully deleted!')
        },
        error: (err) => {
            console.error(`Error deleting employee: ${err}`);
        }
    })
}
// HTTP call to update employee
const updateEmployee = async (employeeId) => {
    const isValid = validateFields(employeeId, 'update');
    if (isValid) {
        const updatedEmployee = {
            firstName: $(`#fname${employeeId}`).val(),
            lastName: $(`#lname${employeeId}`).val(),
            hireDate: $(`#hdate${employeeId}`).val(),
            role: $(`#role${employeeId}`).find('option:selected').text()
        }

        await $.ajax({
            type: "PUT",
            url: `/api/employees/${employeeId}`,
            contentType: 'application/json',
            data: JSON.stringify(updatedEmployee),
            success: async () => {
                clearEmployeeTable();
                await getAllEmployees();
                alert("Employee updated successfully!");    //Ideally this would be a non blocking message like a toast that goes away on it's own
            },
            error: (err) => {
                console.error(`Error updating employee: ${err}`);
            }
        })
    }

}
// HTTP call to create a new employee
const createEmployee = async () => {
    const isValid = validateFields('','new')
    if (isValid) {
        const newEmployee = {
            firstName: $("#newEmployeeFirstName").val(),
            lastName: $("#newEmployeeLastName").val(),
            hireDate: $("#newEmployeeHireDate").val(),
            role: $("#newEmployeeRole").val()
        }
        await $.ajax({
            type: 'POST',
            url: '/api/employees/',
            contentType: 'application/json',
            data: JSON.stringify(newEmployee),
            success: async () => {
                clearEmployeeTable();
                await getAllEmployees()
                //console.log('Employee successfully created!')
            },
            error: (err) => {
                console.error(`Error creating employee: ${err}`);
            }
        })
    }
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
        </tr>`
    )
}
// Dialog box instantiation properties
$("#newEmployeeDialog").dialog({
    autoOpen: false,
    width: "auto",
    height: "auto",
});
const openNewEmployeeDialog = () => {
    $("#newEmployeeDialog").dialog("open");
}

const validateFields = (employeeId, validationArea) => {
    const firstName = (validationArea === 'update') ? $(`#fname${employeeId}`).val() : $(`#newEmployeeFirstName`).val();
    const lastName = (validationArea === 'update') ? $(`#lname${employeeId}`).val() : $(`#newEmployeeLastName`).val();
    const hireDate = (validationArea === 'update') ? $(`#hdate${employeeId}`).val() : $(`#newEmployeeHireDate`).val();

    if (firstName.trim() == null || lastName.trim() == null || firstName.trim() === "" || lastName.trim() === "") {
        alert("First and last name fields must be filled in.")
        return false;
    }
    else if (!isNaN(firstName) || !isNaN(lastName)) {
        alert("First and last name cannot be numbers.")
        return false;
    }
    else if (Date.parse(hireDate) > Date.now()) {
        alert ("Hire date must be in the past.")
        return false;
    }
    return true;
}
