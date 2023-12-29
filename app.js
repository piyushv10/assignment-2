document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const importButton = document.getElementById('importButton');
    const showDataButton = document.getElementById('showDataButton');
    const fileInput = document.getElementById('fileInput');
    const fieldsContainer = document.getElementById('fieldsContainer');
    const dataTable = document.getElementById('dataTable');

    let productsData; // To store fetched JSON data
    let productsArray;

    // Event listener for Import Data button
    importButton.addEventListener('click', function () {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    productsData = JSON.parse(e.target.result);

                    if (!productsData.hasOwnProperty("products")) {
                        console.error('Error: "products" property not found');
                        return;
                    }

                    const productsObject = productsData.products;

                    // Check if productsObject is an object
                    if (typeof productsObject !== 'object') {
                        console.error('Error: "products" is not an object');
                        return;
                    }
                    productsArray = Object.values(productsObject);

                    // Call displayFields function with the first product in the array
                    if (productsArray.length > 0) {
                        displayFields(productsArray[0]);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            reader.readAsText(file);
        } else {
            alert('Please select a JSON file.');
        }
    });

    // Event listener for Show Data button
    showDataButton.addEventListener('click', function () {
        if (productsArray) {
            displayTable();
        } else {
            alert('Please import data first.');
        }
    });

    // Function to display available fields for selection
    function displayFields(product) {
        const fields = Object.keys(product);
        fieldsContainer.innerHTML = `
        <label for="availableFields">Available Fields:</label>
        <select multiple class="form-control" id="availableFields">
            ${fields.map(field => `<option value="${field}">${field}</option>`).join('')}
            <option value="popularity">Popularity</option>
        </select>
        <div class="mt-2">
            <button id="addField" class="btn btn-secondary">&gt;&gt;</button>
            <button id="removeField" class="btn btn-secondary">&lt;&lt;</button>
        </div>
        <label for="displayedFields" class="mt-2">Fields to be Displayed:</label>
        <select multiple class="form-control" id="displayedFields"></select>
    `;

        // Event listeners for adding and removing fields
        const addFieldButton = document.getElementById('addField');
        const removeFieldButton = document.getElementById('removeField');
        const availableFieldsSelect = document.getElementById('availableFields');
        const displayedFieldsSelect = document.getElementById('displayedFields');

        addFieldButton.addEventListener('click', function () {
            moveSelectedOptions(availableFieldsSelect, displayedFieldsSelect);
        });

        removeFieldButton.addEventListener('click', function () {
            moveSelectedOptions(displayedFieldsSelect, availableFieldsSelect);
        });
    }

    // Function to move selected options between two select elements
    function moveSelectedOptions(sourceSelect, destinationSelect) {
        const selectedOptions = Array.from(sourceSelect.selectedOptions);
        selectedOptions.forEach(option => {
            destinationSelect.appendChild(option);
        });
    }

    // Function to display data in a table
    function displayTable() {
        const displayedFieldsSelect = document.getElementById('displayedFields');

        if (!displayedFieldsSelect) {
            console.error("The element with id 'displayedFields' is not found.");
            return;
        }

        const selectedFields = Array.from(displayedFieldsSelect.options).map(option => option.value);

        if (selectedFields.includes('popularity')) {
            productsArray.sort((a, b) => b.popularity - a.popularity);
        }
        
        // Build table headers
        const tableHeaders = `
        <thead>
            <tr>
                ${selectedFields.map(field => '<th>' + field + '</th>').join('')}
            </tr>
        </thead>
    `;

        // Build table rows
        const tableBody = `
        <tbody>
            ${productsArray.map(product => `
                <tr>
                    ${selectedFields.map(field => '<td>' + product[field] + '</td>').join('')}
                </tr>
            `).join('')}
        </tbody>
    `;

        dataTable.innerHTML = tableHeaders + tableBody;
    }
});
