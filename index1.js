$(".supplierSelect").change(function () {
  selectedSupplier = $(this).find("option:selected").text();
  console.log("Selected Supplier: " + selectedSupplier);
  populateTable2(selectedSupplier);
});

var secondRegionSelect2;
$(".regionSelect2").change(function () {
  secondRegionSelect2 = $(this).find("option:selected").text();
  console.log("Selected Region2: " + secondRegionSelect2);
  filterAndFetchUsers2();
});

function filterAndFetchUsers2() {
  console.log("Fetching suppliers for location: " + firstRegionSelect1); // Log the selected region
  if (!secondRegionSelect2) {
    console.error(
      "Second region select is empty. Ensure a region is selected."
    );
    return; // Prevent fetch if no region is selected
  }
  fetch(`/suppliers?location=${encodeURIComponent(secondRegionSelect2)}`) // Ensure the location is encoded
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Users retrieved:", data); // Log the users retrieved
      if (data.length > 0) {
        const filteredData = data.filter(
          (user) => user.Field === selectedSupplier
        );
        if (filteredData.length > 0) {
          populateTable(filteredData);
          $(".no-users-message").hide();
        } else {
          console.log("No suppliers found for the selected labour and region.");
          $(".no-users-message").show();
          populateTable([]); // Clear the table if no data matches the criteria
        }
      } else {
        console.log("No suppliers found for the selected region.");
        $(".no-users-message").show();
        populateTable([]); // Clear the table if no data matches the region
      }
    })
    .catch((error) => console.error("Error fetching users:", error));
}

// Pagination settings
var currentPage = 1;
var rowsPerPage = 10;

// Function to populate the table
function populateTable(data) {
  // Clear previous table data
  $(".hiddenDiv").empty();

  // Create a new table element
  var table = $("<table>").addClass(
    "table table-striped table-bordered table-hover styled-table"
  );

  // Check if there is any data to display
  if (data.length > 0) {
    // Create table header row
    var thead = $("<thead>");
    var headerRow = $("<tr>");

    // Add a header for the row numbers
    headerRow.append($("<th>").text("Index"));

    // Create header cells based on the keys of the first item, excluding "Index"
    $.each(data[0], function (key) {
      if (key !== "Index") {
        var th = $("<th>").text(key);
        headerRow.append(th);
      }
    });

    thead.append(headerRow);
    table.append(thead);
  }

  // Create table body
  var tbody = $("<tbody>");

  // Function to render a specific page
  function renderPage(page) {
    tbody.empty(); // Clear the table body

    // Calculate the start and end indices for the current page
    var start = (page - 1) * rowsPerPage;
    var end = Math.min(start + rowsPerPage, data.length);

    // Iterate over the data for the current page
    for (var i = start; i < end; i++) {
      var item = data[i];
      var row = $("<tr>");

      // Add a cell for the row number
      row.append($("<td>").text(i + 1));

      // Iterate over the keys, excluding "Index"
      $.each(item, function (key, value) {
        if (key !== "Index") {
          // Create a new cell for each key
          var cell = $("<td>").text(value);
          row.append(cell);
        }
      });

      tbody.append(row);
    }

    table.append(tbody);
    $(".hiddenDiv").append(table);

    // Update the pagination controls
    updatePaginationControls(data.length, page);
  }

  // Function to update the pagination controls
  function updatePaginationControls(totalRows, currentPage) {
    var totalPages = Math.ceil(totalRows / rowsPerPage);

    // Clear existing pagination controls
    $(".pagination").remove();

    var pagination = $("<div>").addClass("pagination");

    // Create Previous button
    var prevButton = $("<button>")
      .text("Previous")
      .prop("disabled", currentPage === 1)
      .addClass("btn btn-outline-primary previousButton")
      .click(function () {
        if (currentPage > 1) {
          currentPage--;
          renderPage(currentPage);
        }
      });

    pagination.append(prevButton);

    // Create page buttons
    for (var i = 1; i <= totalPages; i++) {
      var pageButton = $("<button>")
        .text(i)
        .addClass(currentPage === i ? "active" : "")
        .addClass("activeButton btn btn-outline-primary")
        .click(function () {
          currentPage = parseInt($(this).text());
          renderPage(currentPage);
        });

      pagination.append(pageButton);
    }

    // Create Next button
    var nextButton = $("<button>")
      .text("Next")
      .prop("disabled", currentPage === totalPages)
      .addClass("btn btn-outline-primary")
      .click(function () {
        if (currentPage < totalPages) {
          currentPage++;
          renderPage(currentPage);
        }
      });

    pagination.append(nextButton);

    $(".hiddenDiv").append(pagination);
  }

  // Render the first page
  renderPage(currentPage);
}
