let currentPage = 1;
let totalPages = 1;

var clientName;
var clientContact;
var clientEmail;
var textBox;
var selectedProjectLocation;
var selectedTrade;

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
  selectedProjectLocation =
    $("#inputProjectLocation option:selected").text() || "Not Selected";
  selectedTrade = $("#tradeSelected option:selected").text() || "Not Selected";

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

// Function to fetch jobs with pagination and filters
function fetchJobs(page = 1) {
  selectedProjectLocation =
    $("#projectLocation option:selected").text() || null;
  selectedTrade = $("#tradeSelect option:selected").text() || null;

  // Build query parameters for filters and pagination
  let queryParams = [];
  if (selectedTrade && selectedTrade !== "Select Trade:") {
    queryParams.push(`trade=${encodeURIComponent(selectedTrade)}`);
  }
  if (
    selectedProjectLocation &&
    selectedProjectLocation !== "Filter by Location:"
  ) {
    queryParams.push(`location=${encodeURIComponent(selectedProjectLocation)}`);
  }
  queryParams.push(`page=${page}`); // Add page number
  queryParams.push("limit=10"); // Set a limit for pagination

  const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

  // Fetch jobs with constructed query
  fetch(`/jobs${queryString}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched jobs:", data);

      const cardBody = $(".card-body");
      cardBody.empty(); // Clear existing content

      if (data.jobs.length > 0) {
        // Render each job as a separate card
        data.jobs.forEach((job) => {
          const jobCardHTML = `
            <div class="card w-100 mb-3">
              <div class="card-body">
                <h5 class="card-title">${job.Name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${job.Trade} - ${job.Location}</h6>
                <p class="card-text">${job.Description}</p>
                <h6>Email: <a href="mailto:${job.Email}">${job.Email}</a></h6>
                <h6>Phone: ${job.Contact}</h6>
              </div>
            </div>
          `;
          cardBody.append(jobCardHTML);
        });

        // Update pagination
        totalPages = data.totalPages;
        updatePagination();
      } else {
        cardBody.html("<p>No jobs found for the selected filters.</p>");
      }
    })
    .catch((error) => {
      $(".card-body").html(
        "<p>Failed to load jobs. Please try again later.</p>"
      );
      console.error("Error fetching jobs:", error);
    });
}

// Function to update pagination UI
function updatePagination() {
  const paginationDiv = $(".pagination");
  paginationDiv.empty(); // Clear existing pagination

  if (totalPages > 1) {
    // Create previous button
    if (currentPage > 1) {
      paginationDiv.append(`
        <button class="page-link" onclick="changePage(${
          currentPage - 1
        })">Previous</button>
      `);
    }

    // Create page buttons
    for (let i = 1; i <= totalPages; i++) {
      paginationDiv.append(`
        <button class="page-link" onclick="changePage(${i})">${i}</button>
      `);
    }

    // Create next button
    if (currentPage < totalPages) {
      paginationDiv.append(`
        <button class="page-link" onclick="changePage(${
          currentPage + 1
        })">Next</button>
      `);
    }
  }
}

// Function to handle page change
function changePage(page) {
  currentPage = page;
  fetchJobs(page); // Fetch jobs for the new page
  window.scrollTo({
    top: 10,
    behavior: "smooth",
  });
}

$(".page-link").on("click", function () {
  $(".nextDiv")[0].scrollIntoView({
    behavior: "smooth", // Optional: smooth scroll effect
    block: "start", // Align the top of the container with the top of the viewport
  });
});

// Event listener for filtering jobs
$(".showJobs").on("click", function (event) {
  event.preventDefault();
  fetchJobs(1); // Fetch jobs for the first page
});

// Event listener for creating a job
$(".submitJob").on("click", function (e) {
  e.preventDefault();
  clientName = $("#inputClientName").val();
  clientContact = $("#inputClientContact").val();
  clientEmail = $("#inputClientEmail").val();
  textBox = $("#jobDescription").val();

  const data = {
    Name: clientName,
    Contact: clientContact,
    Email: clientEmail,
    Location: selectedProjectLocation,
    Trade: selectedTrade,
    Description: textBox,
  };

  // AJAX request for job creation
  $.ajax({
    url: "http://localhost:3000/create-job",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (response) {
      alert("Job created successfully.");
      fetchJobs(currentPage); // Refresh jobs list after creation
    },
    error: function (error) {
      console.error("Error:", error);
      alert("Error.");
    },
  });
});

// Initial fetch
fetchJobs(currentPage);
