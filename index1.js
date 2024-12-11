var clientName;
var clientContact;
var clientEmail;
var textBox;

// var selectedProjectLocation =
//   $("#inputProjectLocation option:selected").text() || "Not Selected";
// var selectedTrade =
//   $("#tradeSelected option:selected").text() || "Not Selected";

$(".createJob").click(function (event) {
  event.preventDefault();
  $(".jobListingDiv").show();
});

$(".submitJob").on("click", function (e) {
  e.preventDefault();
  clientName = $("#inputClientName").val();
  clientContact = $("#inputClientContact").val();
  clientEmail = $("#inputClientEmail").val();
  textBox = $("#jobDescription").val();

  console.log(
    clientName,
    clientContact,
    clientEmail,
    selectedProjectLocation,
    selectedTrade,
    textBox
  );

  //Data to be sent

  const data = {
    Name: clientName,
    Contact: clientContact,
    Email: clientEmail,
    Location: selectedProjectLocation,
    Trade: selectedTrade,
    Description: textBox,
  };
  console.log("Data to be sent: ", data);

  // AJAX request for job creation
  $.ajax({
    url: "http://localhost:3000/create-job",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (response) {
      console.log("Success:", response);
      alert("Job created successfully.");
    },
    error: function (error) {
      console.error("Error:", error);
      alert("Error.");
    },
  });
});
