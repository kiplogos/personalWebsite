var selectedSupplier;

// Handle the display of the table and selection elements
$(".supplierButton").click(function (event) {
  event.preventDefault();
  $(".loremFlickr").fadeOut(1000);
  $("table").show();
  $(".supplierSelect").show();
  $(".data1, .data2, .data3, .data4, .data5").empty().parent().show();
});

// Update selectedLabour when a selection is made

$(".labourSelect").change(function () {
  selectedLabour = $(this).find("option:selected").text();
  console.log("Selected Labour: " + selectedLabour);
  populateTable(selectedLabour);
});

// Handle POST requests to /signup
app.post("/signup-suppliers", async (req, res) => {
  const { Name, Field, Location, Contact } = req.body;

  // Create a new user instance
  const supplier = new User({ Name, Field, Location, Contact });

  try {
    // Save the user to the database
    await supplier.save();
    console.log("Supplier saved:", { Name, Field, Location, Contact });
    res.json({ message: "Supplier sign up successful!" });
  } catch (err) {
    console.error("Failed to save user", err);
    res.status(500).json({ message: "Sign up failed" });
  }
});

let product = "";
let countySelect2 = "";
$(".labourSelect2").change(function () {
  product = $(this).find("option:selected").text();
  console.log("Selected Product: " + product);
});
$(".countySelect2").change(function () {
  countySelect2 = $(this).find("option:selected").text();
  console.log("Selected County: " + countySelect2);
});

$("#signup-form2").on("submit", function (event) {
  event.preventDefault();

  var phoneNumberSuppliers = $("#phoneNumber").val();
  var phoneNumberPatternSuppliers = /^07\d{8}$/;
  var isValid = phoneNumberPatternSuppliers.test(phoneNumberSuppliers);

  if (!isValid) {
    $("#phoneNumberError").show();
  } else {
    $("#phoneNumberError").hide();

    const supplierName = $("#supplierName").val();
    const supplierContact = $("#phoneNumberSuppliers").val();

    const data2 = {
      Name: supplierName,
      Field: product,
      Location: countySelect2,
      Contact: supplierContact,
    };
    console.log("Data to be sent:", data2);

    $.ajax({
      url: "http://localhost:3000/signup-suppliers",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data2),
      success: function (response) {
        console.log("Success:", response);
        alert("Supplier Sign up successful");
      },
      error: function (error) {
        console.error("Error:", error);
        alert("Supplier Sign up failed");
      },
    });
  }
});

// Function to populate the table based on the selected labour field
var currentPage = 1;
var rowsPerPage = 10;

var currentPage = 1;
var rowsPerPage = 10;

function populateTable(selectedSupplier) {
  $.getJSON("/suppliers", function (data) {
    // Clear previous table data
    $(".hiddenDiv").empty();

    // Filter data based on selected labour field
    var filteredData = data.filter(
      (item) => item["Field"] === selectedSupplier
    );

    // Create a new table element
    var table = $("<table>").addClass(
      "table table-striped table-bordered table-hover styled-table"
    );

    // Check if there is any data to display
    if (filteredData.length > 0) {
      // Create table header row
      var thead = $("<thead>");
      var headerRow = $("<tr>");

      // Add a header for the row numbers
      headerRow.append($("<th>").text("Index"));

      // Create header cells based on the keys of the first item, excluding "Index"
      $.each(filteredData[0], function (key, value) {
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
      var end = Math.min(start + rowsPerPage, filteredData.length);

      // Iterate over the data for the current page
      for (var i = start; i < end; i++) {
        var item = filteredData[i];
        var row = $("<tr>");

        // Add a cell for the row number
        row.append($("<td>").text(i + 1));

        // Iterate over the keys, excluding "Index"
        $.each(item, function (key, value) {
          if (key !== "Index") {
            // Create a new cell for each key
            var cell = $("<td>").text(value);
            // Append the cell to the row
            row.append(cell);
          }
        });

        // Append the row to the table body
        tbody.append(row);
      }

      table.append(tbody);

      // Append the table to the div with class "hiddenDiv"
      $(".hiddenDiv").append(table);

      // Update the pagination controls
      updatePaginationControls(filteredData.length, page);
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

      // Append the pagination controls to the div with class "hiddenDiv"
      $(".hiddenDiv").append(pagination);
    }

    // Render the first page
    renderPage(currentPage);
  }).fail(function (jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    console.log("Error fetching JSON data: " + err);
  });
}
