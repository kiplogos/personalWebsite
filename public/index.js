// $(".about").click(function (event) {
//   event.preventDefault();
//   $(".carousel").html($(".showAbout").html());
// });
$(document).ready(function () {
  $(".experience").click(function (event) {
    event.preventDefault();
    $(".carousel1").empty();
    $(".carousel1").hide().html($(".showExperience").html()).fadeIn(700);
  });

  $(".projects").click(function (event) {
    event.preventDefault();
    $(".carousel1").empty();
    $(".carousel1").hide().html($(".showProjects").html()).fadeIn(700);
  });

  $(".contacts").click(function (event) {
    event.preventDefault();
    $(".carousel1").empty();
    $(".carousel1").hide().html($(".showContacts").html()).fadeIn(700);
  });

  $(".about").click(function (event) {
    event.preventDefault();
    window.location.href = "/public/index.html";
  });

  $(".navbar-toggler").click(function () {
    $(".nav").slideToggle("slow");
    $(".container2").toggleClass("pushed-down");
  });

  $(window).resize(function () {
    if ($(window).width() > 768) {
      $(".container2").removeClass("pushed-down");
    }
  });
});
