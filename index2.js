var shs1 = 0.923;
var selectedGauge;
var selectedSection;
var selectedMix;
var selectedRebar;
var rebarWeight;

$(".tool1").click(function (event) {
  event.preventDefault();
  $(".steelEstimator").show();
  $(".concreteEstimator").hide();
  $(".display1").hide();
  $(".intro").hide();
  $(".sizeSelect").hide();
  $(".sizeSelect2").hide();
  $(".sizeSelect3").hide();
  $(".alert").hide();
  $(".assumptions").hide();
  $(".rebarCalculator").hide();
});

$(".sectionSelect").change(function () {
  selectedSection = $(this).find("option:selected").text();
  console.log("Selected Section: " + selectedSection);
  if (selectedSection == "Circular Hollow Section(C.H.S)") {
    $(".sizeSelect").hide();
    $(".sizeSelect2").hide();
    $(".sizeSelect3").show();
  } else if (selectedSection == "Rectangular Hollow Section (R.H.S)") {
    $(".sizeSelect").hide();
    $(".sizeSelect3").hide();
    $(".sizeSelect2").show();
  } else if (selectedSection == "Square Hollow Section (S.H.S)") {
    $(".sizeSelect3").hide();
    $(".sizeSelect2").hide();
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

  // Fetch JSON data
  $.getJSON("data.JSON", function (data) {
    $.each(data, function (index, item) {
      var section = item["Section"];
      var size = item["Size"];
      var thickness = item["Thickness (mm)"];
      var weight = item["Kgs/6mtr"];
      var xFactor = item["Factor"];

      if (
        size == selectedSize &&
        section == selectedSection &&
        thickness == selectedGauge
      ) {
        matchFound = true;
        console.log(selectedSize + " is a match.");
        var length = $(".steelLength").val();
        console.log("Length is: " + length);

        var steelWeight = length * xFactor;
        var piecesTon = (1000 * steelPieces).toFixed(3);
        var steelPieces = length / 6;
        $(".display2").show();
        $(".showSteelWeight").text(steelWeight.toFixed(3));
        $(".showSteelPieces").text(steelPieces.toFixed(3));
        $(".showSteelTon").text(
          ((1000 * steelPieces) / steelWeight).toFixed(3)
        );
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

// Concrete Materials

$(".tool2").click(function (event) {
  event.preventDefault();
  $(".concreteEstimator").show();
  $(".intro").hide();
  $(".steelEstimator").hide();
  $(".rebarCalculator").hide();
  $(".display2").hide();
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
  // alert(
  //   "Concrete density: 1440 Kg/m3 Sand Density: 1602 Kg/m3 Aggregate Density: 2400 Kg/m3"
  // );
});
$(".submit2").click(function (event) {
  event.preventDefault();

  var volumeInput = $(".concreteVolume").val();
  var cement1 = Math.ceil((0.18 * volumeInput * 1440) / 50);
  var sand1 = (0.273 * volumeInput * 1602) / 1000;
  sand1 = sand1.toFixed(2);
  var aggregate1 = Math.round(0.55 * volumeInput * 2400) / 1000;
  aggregate1 = aggregate1.toFixed(2);

  if (selectedMix == "1:1.5:3") {
    console.log(cement1, sand1, aggregate1);
    $(".display1").show();
    $(".showCement1").text(cement1);
    $(".showSand1").text(sand1);
    $(".showAggregate1").text(aggregate1);
  } else if (selectedMix == "1:2:4") {
    var volumeInput = $(".concreteVolume").val();
    var cement1 = Math.ceil((0.143 * volumeInput * 1440) / 50);
    var sand1 = (0.286 * volumeInput * 1602) / 1000;
    sand1 = sand1.toFixed(2);
    var aggregate1 = Math.round(0.571 * volumeInput * 2400) / 1000;
    aggregate1 = aggregate1.toFixed(2);
    console.log(cement1, sand1, aggregate1);
    $(".display1").show();
    $(".showCement1").text(cement1);
    $(".showSand1").text(sand1);
    $(".showAggregate1").text(aggregate1);
  } else if (selectedMix == "1:3:6") {
    var volumeInput = $(".concreteVolume").val();
    var cement1 = Math.ceil((0.1 * volumeInput * 1440) / 50);
    var sand1 = (0.3 * volumeInput * 1602) / 1000;
    sand1 = sand1.toFixed(2);
    var aggregate1 = Math.round(0.6 * volumeInput * 2400) / 1000;
    aggregate1 = aggregate1.toFixed(2);
    console.log(cement1, sand1, aggregate1);
    $(".display1").show();
    $(".showCement1").text(cement1);
    $(".showSand1").text(sand1);
    $(".showAggregate1").text(aggregate1);
  } else if (selectedMix == "1:4:8") {
    var volumeInput = $(".concreteVolume").val();
    var cement1 = Math.ceil((0.077 * volumeInput * 1440) / 50);
    var sand1 = (0.308 * volumeInput * 1602) / 1000;
    sand1 = sand1.toFixed(2);
    var aggregate1 = Math.round(0.615 * volumeInput * 2400) / 1000;
    aggregate1 = aggregate1.toFixed(2);
    console.log(cement1, sand1, aggregate1);
    $(".display1").show();
    $(".showCement1").text(cement1);
    $(".showSand1").text(sand1);
    $(".showAggregate1").text(aggregate1);
  }
});

// Rebar Calculator
$(".tool3").click(function (event) {
  event.preventDefault();
  $(".rebarCalculator").show();
  $(".concreteEstimator").hide();
  $(".intro").hide();
  $(".steelEstimator").hide();
  $(".display2").hide();
});

$(".rebarSelect").change(function () {
  selectedRebar = $(this).find("option:selected").val();
  console.log("Selected Rebar is: " + selectedRebar);
});

$(".submit3").click(function () {
  console.log("Clicked!");
  var rebarLength2 = $(".rebarLength").val();
  console.log(rebarLength2);

  rebarWeight = (selectedRebar ** 2 * rebarLength2) / 162;
  var roundedRebarWeight = rebarWeight.toFixed(3);
  var rebarPieces = (rebarLength2 / 6).toFixed(2);
  console.log(rebarWeight);
  $(".display3").show();
  $(".showRebar").text(roundedRebarWeight);
  $(".showRebarPieces").text(rebarPieces);
});