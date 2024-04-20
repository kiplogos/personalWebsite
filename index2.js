var shs1 = 0.923;
var selectedGauge;
var selectedSection;
var selectedMix;

$(".tool1").click(function (event) {
  event.preventDefault();
  $(".steelEstimator").show();
  $(".concreteEstimator").hide();
  $(".display1").hide();
  $(".intro").hide();
});

$(".sectionSelect").change(function () {
  selectedSection = $(this).find("option:selected").text();
  console.log("Selected Section: " + selectedSection);
});

$(".sizeSelect").change(function () {
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
        $(".display2").show();
        $(".showSteelWeight").text(steelWeight);
      } else {
      }
    });
  });
});

// Concrete Materials

$(".tool2").click(function (event) {
  event.preventDefault();
  $(".concreteEstimator").show();
  $(".intro").hide();
  $(".steelEstimator").hide();
});

$(".mixSelect").change(function () {
  selectedMix = $(this).find("option:selected").text();
  console.log("Selected Mix Ratio: " + selectedMix);
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
