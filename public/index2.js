var shs1 = 0.923;
var selectedGauge;
var selectedSection;
var selectedSize;
var selectedMix;
var selectedRebar;
var rebarWeight;
var selectedLabour;


$(".fundiHomepage").click(function (event) {
  event.preventDefault();
  $(".usefulContacts").show();
});

$(".registerButton").click(function (event) {
  event.preventDefault();
  $(".usefulContacts").show();
});

// Tool 1: Steel Estimator
$(".tool1").click(function (event) {
  event.preventDefault();
  $(".steelEstimator").show();
  $(
    ".barBendingSchedule, .concreteEstimator, .display1, .intro, .sizeSelect, .sizeSelect2, .sizeSelect3, .alert, .assumptions, .rebarCalculator, .usefulContacts"
  ).hide();
});

$(".sectionSelect").change(function () {
  selectedSection = $(this).find("option:selected").text();
  console.log("Selected Section: " + selectedSection);
  if (selectedSection == "Circular Hollow Section(C.H.S)") {
    $(".sizeSelect, .sizeSelect2").hide();
    $(".sizeSelect3").show();
  } else if (selectedSection == "Rectangular Hollow Section (R.H.S)") {
    $(".sizeSelect, .sizeSelect3").hide();
    $(".sizeSelect2").show();
  } else if (selectedSection == "Square Hollow Section (S.H.S)") {
    $(".sizeSelect2, .sizeSelect3").hide();
    $(".sizeSelect").show();
  }
});

$(".sizeSelect, .sizeSelect2, .sizeSelect3").change(function () {
  selectedSize = $(this).find("option:selected").text();
  console.log("Selected Size: " + selectedSize);
});

$(".gaugeSelect").change(function () {
  selectedGauge = $(this).find("option:selected").text();
  console.log("Selected Gauge: " + selectedGauge);
});

$(".submit1").click(function (event) {
  event.preventDefault();
  var matchFound = false;

  $.getJSON("/steel_datas", function (data) {
    $.each(data, function (index, item) {
      var section = item["Section"];
      var size = item["Size"];
      var thickness = item["Thickness_mm"];
      var xFactor = item["Factor"];

      if (
        size == selectedSize &&
        section == selectedSection &&
        thickness == selectedGauge
      ) {
        matchFound = true;
        console.log(selectedSize + " is a match.");
        var length = $(".steelLength").val();
        var steelWeight = length * xFactor;
        var steelPieces = length / 6;
        var piecesTon = (1000 * steelPieces).toFixed(3);

        $(".display2").show();
        $(".showSteelWeight").text(steelWeight.toFixed(3));
        $(".showSteelPieces").text(steelPieces.toFixed(3));
        $(".showSteelTon").text(piecesTon);
        return false;
      }
    });

    if (!matchFound) {
      $(".alert").show();
      setTimeout(function () {
        $(".alert").hide();
      }, 1500);
    }
  });
});

// Tool 2: Concrete Estimator
$(".tool2").click(function (event) {
  event.preventDefault();
  $(".concreteEstimator").show();
  $(
    ".intro, .steelEstimator, .rebarCalculator, .display2, .usefulContacts,.barBendingSchedule"
  ).hide();
});

$(".mixSelect").change(function () {
  selectedMix = $(this).find("option:selected").text();
  console.log("Selected Mix Ratio: " + selectedMix);
});

$(".assumptionsButton").click(function (event) {
  event.preventDefault();
  $(".assumptions").show();
  setTimeout(function () {
    $(".assumptions").hide();
  }, 7500);
});

$(".submit2").click(function (event) {
  event.preventDefault();
  var volumeInput = $(".concreteVolume").val();
  var cement1, sand1, aggregate1;

  if (selectedMix == "1:1.5:3") {
    cement1 = Math.ceil((0.18 * volumeInput * 1440) / 50);
    sand1 = (0.273 * volumeInput * 1602) / 1000;
    aggregate1 = Math.round(0.55 * volumeInput * 2400) / 1000;
  } else if (selectedMix == "1:2:4") {
    cement1 = Math.ceil((0.143 * volumeInput * 1440) / 50);
    sand1 = (0.286 * volumeInput * 1602) / 1000;
    aggregate1 = Math.round(0.571 * volumeInput * 2400) / 1000;
  } else if (selectedMix == "1:3:6") {
    cement1 = Math.ceil((0.1 * volumeInput * 1440) / 50);
    sand1 = (0.3 * volumeInput * 1602) / 1000;
    aggregate1 = Math.round(0.6 * volumeInput * 2400) / 1000;
  } else if (selectedMix == "1:4:8") {
    cement1 = Math.ceil((0.077 * volumeInput * 1440) / 50);
    sand1 = (0.308 * volumeInput * 1602) / 1000;
    aggregate1 = Math.round(0.615 * volumeInput * 2400) / 1000;
  }

  $(".display1").show();
  $(".showCement1").text(cement1);
  $(".showSand1").text(sand1.toFixed(2));
  $(".showAggregate1").text(aggregate1.toFixed(2));
});

// Tool 3: Rebar Calculator
$(".tool3").click(function (event) {
  event.preventDefault();
  $(".rebarCalculator").show();
  $(
    ".concreteEstimator, .intro, .steelEstimator, .display2, .usefulContacts,.barBendingSchedule"
  ).hide();
});

$(".rebarSelect").change(function () {
  selectedRebar = $(this).find("option:selected").val();
  console.log("Selected Rebar is: " + selectedRebar);
});

$(".submit3").click(function (event) {
  event.preventDefault();
  var rebarLength2 = $(".rebarLength").val();
  rebarWeight = (selectedRebar ** 2 * rebarLength2) / 162;
  var roundedRebarWeight = rebarWeight.toFixed(3);
  var rebarPieces = (rebarLength2 / 6).toFixed(2);

  $(".display3").show();
  $(".showRebar").text(roundedRebarWeight);
  $(".showRebarPieces").text(rebarPieces);
});

// Tool 4: Useful Contacts
$(".tool4").click(function (event) {
  event.preventDefault();
  $(".usefulContacts").show();
  $(
    ".intro, .steelEstimator, .rebarCalculator, .display2, .concreteEstimator, .barBendingSchedule"
  ).hide();
});

// new Signups

var selectedSupplier;

// Handle the display of the table and selection elements for suppliers
$(".suppliersButton").click(function (event) {
  event.preventDefault();
  $(".loremFlickr").fadeOut(1000);
  $("table").show();
  $(".supplierSelect").show();
  $(".labourSelect").hide();
  $(".regionSelect2").show();
  $(".regionSelect1").hide();
});

var selectedLabour;

// Handle the display of the table and selection elements for labour
$(".labourButton").click(function (event) {
  event.preventDefault();
  $(".loremFlickr").fadeOut(500);
  $("table").show();
  $(".labourSelect").show();
  $(".supplierSelect").hide();
  $(".data1, .data2, .data3, .data4, .data5").empty().parent().show();
  $(".regionSelect1").show();
  $(".regionSelect2").hide();
});

// Update selectedLabour when a selection is made

$(".labourSelect").change(function () {
  selectedLabour = $(this).find("option:selected").text();
  console.log("Selected Labour: " + selectedLabour);
  filterAndFetchUsers();
});

var firstRegionSelect1;
$(".regionSelect1").change(function () {
  firstRegionSelect1 = $(this).find("option:selected").text();
  console.log("Selected Region1: " + firstRegionSelect1);
  filterAndFetchUsers();
});

function filterAndFetchUsers() {
  console.log("Fetching users for location: " + firstRegionSelect1); // Log the selected region
  if (!firstRegionSelect1) {
    console.error("First region select is empty. Ensure a region is selected.");
    return; // Prevent fetch if no region is selected
  }
  fetch(`/users?location=${encodeURIComponent(firstRegionSelect1)}`) // Ensure the location is encoded
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
          (user) => user.Field === selectedLabour
        );
        if (filteredData.length > 0) {
          populateTable(filteredData);
          $(".no-users-message").hide();
        } else {
          console.log("No users found for the selected labour and region.");
          $(".no-users-message").show();
          populateTable([]); // Clear the table if no data matches the criteria
        }
      } else {
        console.log("No users found for the selected region.");
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

// Function to populate the table based on the selected product field
var currentPage = 1;
var rowsPerPage = 10;
$(".supplierSelect").change(function () {
  selectedSupplier = $(this).find("option:selected").text();
  console.log("Selected Supplier: " + selectedSupplier);
  filterAndFetchUsers2();
});

var secondRegionSelect2;
$(".regionSelect2").change(function () {
  secondRegionSelect2 = $(this).find("option:selected").text();
  console.log("Selected Region2: " + secondRegionSelect2);
  filterAndFetchUsers2();
});

function filterAndFetchUsers2() {
  console.log("Fetching suppliers for location: " + secondRegionSelect2); // Log the selected region
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
      console.log("Suppliers retrieved:", data); // Log the users retrieved
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

// Tool 5: Bar Bending Schedule

$(".tool5").click(function (event) {
  event.preventDefault();
  $(
    ".steelEstimator, .concreteEstimator, .display1, .intro, .sizeSelect, .sizeSelect2, .sizeSelect3, .alert, .assumptions, .rebarCalculator, .usefulContacts"
  ).hide();
  $(".barBendingSchedule").show();
});

var selectedBeam;
var selectedStirrupAngle;

$(".selectedBeam").change(function () {
  selectedBeam = parseFloat($(this).find("option:selected").text());
  console.log("Selected Beam is: " + selectedBeam);
});

$(".selectedStirrupAngle").change(function () {
  selectedStirrupAngle = parseFloat($(this).find("option:selected").val());
  console.log("Selected Stirrup Angle is: " + selectedStirrupAngle);
  console.log(typeof selectedStirrupAngle);
});

$(".bbsSubmit").click(function (event) {
  event.preventDefault();
  $(".bbsDiv").show();

  var clearSpan = parseFloat($(".clearSpan").val()),
    beamWidth = parseFloat($(".beamWidth").val()),
    beamDepth = parseFloat($(".beamDepth").val()),
    developmentLength = parseFloat($(".developmentLength").val()),
    topDiameter = parseFloat($(".topDiameter").val()),
    topBars = parseFloat($(".topBars").val()),
    clearCover = parseFloat($(".clearCover").val()),
    bottomDiameter = parseFloat($(".bottomDiameter").val()),
    bottomBars = parseFloat($(".bottomBars").val()),
    stirrupSpacing = parseFloat($(".stirrupSpacing").val()),
    stirrupBends = parseFloat($(".stirrupBends").val()),
    stirrupDiameter = parseFloat($(".stirrupDiameter").val()),
    stirrupHooks = parseFloat($(".stirrupHooks").val());

  // Top Bar
  var topBarCuttingLength =
    clearSpan + 2 * developmentLength * topDiameter - 2 * clearCover;
  console.log("Top Bar cutting length is " + topBarCuttingLength);

  // Bottom Bar
  //prettier-ignore
  var bottomBarCuttingLength =
    clearSpan + (2 * developmentLength * bottomDiameter) - (2 * clearCover);
  console.log("Bottom Bar cutting length is " + bottomBarCuttingLength);

  // Stirrups
  if (selectedStirrupAngle === 45) {
    selectedStirrupAngle = 1 * stirrupDiameter;
    console.log(selectedStirrupAngle);
    console.log(typeof selectedStirrupAngle);
  } else if (selectedStirrupAngle === 90) {
    selectedStirrupAngle = 2 * stirrupDiameter;
    console.log(selectedStirrupAngle);
  } else {
    selectedStirrupAngle = 3 * stirrupDiameter;
    console.log(selectedStirrupAngle);
  }

  var stirrupNumber = Math.ceil(clearSpan / stirrupSpacing + 1);

  //prettier-ignore
  var stirrupCuttingLength =
    2 * (beamDepth +
    beamWidth) +
    (stirrupBends * selectedStirrupAngle) +
    (stirrupHooks * 9 * stirrupDiameter);
  var stirrupTotalLength = stirrupCuttingLength * stirrupNumber;
  //prettier-ignore
  var stirrupsWeight = (((stirrupDiameter ** 2 * stirrupTotalLength) /162) *0.001).toFixed(2);

  var totalBottomLength = bottomBarCuttingLength * bottomBars;
  var totalTopLength = topBarCuttingLength * topBars;
  console.log(totalBottomLength);

  //prettier-ignore
  var topBarWeight = (((topDiameter ** 2 * totalTopLength) /162) *0.001).toFixed(2);

  //prettier-ignore
  var bottomBarWeight = (((bottomDiameter ** 2 * totalBottomLength) / 162) * 0.001).toFixed(2);

  console.log(bottomBarWeight);

  console.log("bottom bars : ", bottomBars);
  console.log("bottom bars diameter : ", bottomDiameter);
  console.log("bottom bars cutting length : ", bottomBarCuttingLength);

  $(".topBarCell1").text(topDiameter);
  $(".topBarCell2").text(topBars);
  $(".topBarCell3").text(topBarCuttingLength * 0.001);
  $(".topBarCell4").text(topBarCuttingLength * 0.001 * topBars);
  $(".topBarCell5").text(topBarWeight);

  $(".bottomBarCell1").text(bottomDiameter);
  $(".bottomBarCell2").text(bottomBars);
  $(".bottomBarCell3").text(bottomBarCuttingLength * 0.001);
  $(".bottomBarCell4").text(bottomBarCuttingLength * 0.001 * bottomBars);
  $(".bottomBarCell5").text(bottomBarWeight);

  $(".stirrupsCell1").text(stirrupDiameter);
  $(".stirrupsBarCell2").text(stirrupNumber);
  $(".stirrupsBarCell3").text((stirrupCuttingLength * 0.001).toFixed(2));
  $(".stirrupsBarCell4").text(
    (stirrupNumber * stirrupCuttingLength * 0.001).toFixed(2)
  );
  $(".stirrupsBarCell5").text(stirrupsWeight);

  var beamName = $(".beamName").val();
  console.log(beamName);
  $(".changeTableHeading").text(beamName);
});

$(".joinUs").click(function (event) {
  event.preventDefault();
  $(".hideForm").show();
});

let trade = "";
let countySelect = "";
$(".labourSelect2").change(function () {
  trade = $(this).find("option:selected").text();
  console.log("Selected Labour: " + trade);
});
$(".countySelect").change(function () {
  countySelect = $(this).find("option:selected").text();
  console.log("Selected County: " + countySelect);
});

$("#signup-form").on("submit", function (event) {
  event.preventDefault();

  var phoneNumber = $("#phoneNumber").val();
  var phoneNumberPattern = /^(07|01)\d{8}$/;

  var isValid = phoneNumberPattern.test(phoneNumber);

  if (!isValid) {
    $("#phoneNumberError").show();
  } else {
    $("#phoneNumberError").hide();

    const name = $("#name").val();
    const contact = $("#phoneNumber").val();

    const data = {
      Name: name,
      Field: trade,
      Location: countySelect,
      Contact: contact,
    };
    console.log("Data to be sent:", data);

    $.ajax({
      url: "http://localhost:3000/signup-labour",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (response) {
        console.log("Success:", response);
        alert("Sign up successful");
      },
      error: function (error) {
        console.error("Error:", error);
        alert("Sign up failed");
      },
    });
  }
});

//Visitors
// Register button event for debugging
$(".registerButton").click(function (event) {
  event.preventDefault();

  var visitorName = $("#userName").val();
  var visitorContact = $("#userContact").val();
  var visitorEmail = $("#userEmail").val();
  var visitorPassword = $("#userPassword").val();
  var visitorRepeatPassword = $("#userRepeatPassword").val();

  console.log(
    "New User Details: ",
    visitorName,
    visitorContact,
    visitorEmail,
    visitorPassword,
    visitorRepeatPassword
  );
});
processData: true,
  // Visitor signup form
  $("#signup-form3").on("submit", function (event) {
    event.preventDefault();

    // Retrieve form values
    var visitorName = $("#userName").val();
    var visitorContact = $("#userContact").val();
    var visitorEmail = $("#userEmail").val();
    var visitorPassword = $("#userPassword").val();
    var visitorRepeatPassword = $("#userRepeatPassword").val();

    // Phone number validation
    var phoneNumberPatternVisitors = /^(07|01)\d{8}$/;
    var isValidPhoneNumber2 = phoneNumberPatternVisitors.test(visitorContact);

    // Email validation
    var emailInput2 = $("#userEmail")[0];
    var emailError2 = $("#emailError2"); // Error message element for email validation

    if (!emailInput2.checkValidity()) {
      emailError2.show(); // Show error if email is invalid
      return; // Prevent form submission if email is invalid
    } else {
      emailError2.hide(); // Hide error if email is valid
    }

    // Show phone number error if invalid
    if (!isValidPhoneNumber2) {
      $("#phoneNumberError2").show(); // Show error for phone number
      return; // Prevent further processing if phone number is invalid
    } else {
      $("#phoneNumberError2").hide(); // Hide phone number error
    }

    // Password match validation
    if (visitorPassword !== visitorRepeatPassword) {
      $("#passwordMatchError").show(); // Show error if passwords do not match
      return;
    } else {
      $("#passwordMatchError").hide(); // Hide error if passwords match
    }

    // Data to be sent
    const data3 = {
      Name: visitorName,
      Contact: visitorContact,
      Email: visitorEmail,
      Password: visitorPassword,
    };
    console.log("Data to be sent:", data3);

    // AJAX request for visitor signup
    $.ajax({
      url: "http://localhost:3000/create-job",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data3),
      success: function (response) {
        console.log("Success:", response);
        alert(" Job listing created successfully!");
      },
      error: function (error) {
        console.error("Error:", error);
        alert("Error!");
      },
    });
  });

// Suppliers
let product = "";
let countySelect2 = "";
$(".supplierSelect2").change(function () {
  product = $(this).find("option:selected").text();
  console.log("Selected Product: " + product);
});
$(".countySelect2").change(function () {
  countySelect2 = $(this).find("option:selected").text();
  console.log("Selected County: " + countySelect2);
});

// Supplier signup form
$("#signup-form2").on("submit", function (event) {
  event.preventDefault();

  // Phone number validation
  var phoneNumberSuppliers = $("#phoneNumberSuppliers").val();
  var phoneNumberPatternSuppliers = /^(07|01)\d{8}$/;
  var isValidPhoneNumber =
    phoneNumberPatternSuppliers.test(phoneNumberSuppliers);

  // Email validation
  const emailInput = $("#emailSuppliers")[0]; // Ensure you have an input field with id="emailSuppliers"
  const emailError = $("#emailError"); // Ensure you have an error message element with id="emailError"
  if (!emailInput.checkValidity()) {
    emailError.show(); // Show error if email is invalid
    return; // Prevent form submission if email is invalid
  } else {
    emailError.hide(); // Hide error if email is valid
  }

  // Show phone number error if invalid
  if (!isValidPhoneNumber) {
    $("#phoneNumberError2").show(); // Show error for phone number
    return; // Prevent further processing if phone number is invalid
  } else {
    $("#phoneNumberError2").hide(); // Hide phone number error
  }

  // Get supplier data
  const supplierName = $("#supplierName").val();
  const supplierContact = $("#phoneNumberSuppliers").val();
  console.log(supplierName, supplierContact);

  const data2 = {
    Name: supplierName,
    Field: product,
    Location: countySelect2,
    Contact: supplierContact,
    Email: emailInput.value, // Add email to the data object
  };
  console.log("Data to be sent:", data2);

  // AJAX request for supplier signup
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
});

