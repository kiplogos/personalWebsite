var shs1 = 0.923;
var selectedGauge;
var selectedSection;
var selectedSize;
var selectedMix;
var selectedRebar;
var rebarWeight;
var selectedLabour;

// Tool 1: Steel Estimator
$(".tool1").click(function (event) {
  event.preventDefault();
  $(".steelEstimator").show();
  $(
    ".concreteEstimator, .display1, .intro, .sizeSelect, .sizeSelect2, .sizeSelect3, .alert, .assumptions, .rebarCalculator, .usefulContacts"
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

  $.getJSON("data.JSON", function (data) {
    $.each(data, function (index, item) {
      var section = item["Section"];
      var size = item["Size"];
      var thickness = item["Thickness (mm)"];
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

var selectedLabour;

// Handle the display of the table and selection elements
$(".labourButton").click(function (event) {
  event.preventDefault();
  $(".unsplash").fadeOut(1000);
  $("table").show();
  $(".labourSelect").show();
  $(".data1, .data2, .data3, .data4, .data5").empty().parent().show();
});

// Update selectedLabour when a selection is made

$(".labourSelect").change(function () {
  selectedLabour = $(this).find("option:selected").text();
  console.log("Selected Labour: " + selectedLabour);
  populateTable(selectedLabour);
});

// Function to populate the table based on the selected labour field
var currentPage = 1;
var rowsPerPage = 10;

var currentPage = 1;
var rowsPerPage = 10;

function populateTable(selectedLabour) {
  $.getJSON("/users", function (data) {
    // Clear previous table data
    $(".hiddenDiv").empty();

    // Filter data based on selected labour field
    var filteredData = data.filter((item) => item["Field"] === selectedLabour);

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

// Tool 5: Bar Bending Schedule

$(".tool5").click(function (event) {
  event.preventDefault();
  $(
    ".concreteEstimator, .display1, .intro, .sizeSelect, .sizeSelect2, .sizeSelect3, .alert, .assumptions, .rebarCalculator, .usefulContacts"
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

$("#signup-form").on("submit", function (event) {
  event.preventDefault();
  const name = $("#name").val();
  const trade = $("#trade").val();
  const location = $("#location").val();
  const contact = $("#phoneNumber").val();

  const data = {
    Name: name,
    Field: trade,
    Location: location,
    Contact: contact,
  };
  console.log("Data to be sent:", data);

  $.ajax({
    url: "http://localhost:3000/signup",
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
});
