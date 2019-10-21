// Check if a user is logged in
const user = window.localStorage.getItem("user");
let userDetails = {};
const parseJwt = token => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

if (!user) {
  $(".logged-in").hide();
  $(".logged-out").show();
} else {
  userDetails = parseJwt(user);
  $("#userDetails").text(`${userDetails.firstName} ${userDetails.lastName}`);
  $(".logged-in").show();
  $(".logged-out").hide();
}
$(".alert").hide();

const apiUrl = "https://pelf-api.herokuapp.com/api/v1/";

const urlParams = new URLSearchParams(window.location.search);

$(() => {
  // Login Section
  $("#login-form").on("submit", e => {
    e.preventDefault();
    $("#login-button").attr("disabled", true);
    const email = $("#email").val();
    const password = $("#password").val();
    const data = { email, password };
    $.ajax({
      url: apiUrl + "auth/login",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      error: res => {
        $("#login-alert").addClass("alert-danger");
        $("#login-alert").removeClass("alert-success");
        if (res.statusText === "error") {
          $("#login-alert").text(
            "Oops! Something went wrong, It's not you, it's us. Please try again later."
          );
        } else {
          $("#login-alert").text("Invalid Login Details");
        }
        $("#login-alert").show();
        $("#login-button").attr("disabled", false);
      }
    }).done(res => {
      window.localStorage.setItem("user", res.token);
      $("#login-alert").addClass("alert-success");
      $("#login-alert").removeClass("alert-danger");
      $("#login-alert").text("Login Successful");
      $("#login-alert").show();
      window.location = "/dashboard";
    });
  });

  // Password Rest Section
  $("#password-reset-form").on("submit", e => {
    e.preventDefault();
    $("#password-reset-button").attr("disabled", true);
    const email = $("#email").val();
    const data = { email };
    $.ajax({
      url: apiUrl + "auth/init-reset",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      error: res => {
        $("#password-reset-alert").addClass("alert-danger");
        $("#password-reset-alert").removeClass("alert-success");
        if (res.statusText === "error") {
          $("#password-reset-alert").text(
            "Oops! Something went wrong, It's not you, it's us. Please try again later."
          );
        } else {
          $("#password-reset-alert").text("Email not found");
        }
        $("#password-reset-alert").show();
        $("#password-reset-button").attr("disabled", false);
      }
    }).done(res => {
      $("#password-reset-alert").addClass("alert-success");
      $("#password-reset-alert").removeClass("alert-danger");
      $("#password-reset-alert").text(
        "An email with a link to reset your password has been sent"
      );
      $("#password-reset-alert").show();
      window.location = "/login";
    });
  });

  $("#new-password-form").on("submit", e => {
    e.preventDefault();
    $("#password-reset-button").attr("disabled", true);
    const password = $("#new-password").val();
    const verifyPassword = $("#verify-password").val();
    const email = urlParams.get("email");
    if (password !== verifyPassword) {
      $("#password-reset-alert").addClass("alert-danger");
      $("#password-reset-alert").removeClass("alert-success");
      $("#password-reset-alert").text("Password Mismatch");
      $("#password-reset-alert").show();
      $("#password-reset-button").attr("disabled", false);
    } else {
      $.ajax({
        url: apiUrl + "auth/reset",
        type: "POST",
        data: JSON.stringify({ email, password }),
        contentType: "application/json",
        error: res => {
          console.log(res);
          $("#password-reset-alert").addClass("alert-danger");
          $("#password-reset-alert").removeClass("alert-success");
          $("#password-reset-alert").text(res.responseJSON.message);
          $("#password-reset-alert").show();
          $("#password-reset-button").attr("disabled", false);
        }
      }).done(res => {
        console.log(res);
        $("#password-reset-alert").addClass("alert-success");
        $("#password-reset-alert").removeClass("alert-danger");
        $("#password-reset-alert").text(res.message);
        $("#password-reset-alert").show();
        window.location = "/login";
      });
    }
  });

  // Log out section
  $("#logout").on("click", e => {
    e.preventDefault();
    window.localStorage.removeItem("user");
    window.location = "/login";
  });

  // Register section
  $("#register-form").on("submit", e => {
    e.preventDefault();
    $("#register-button").attr("disabled", true);
    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const data = { firstName, lastName, email, password };
    $.ajax({
      url: apiUrl + "auth/signup",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      timeout: 15000,
      error: res => {
        console.log(res);
        $("#register-alert").addClass("alert-danger");
        $("#register-alert").removeClass("alert-success");
        if (res.statusText === "error") {
          $("#register-alert").text(
            "Oops! Something went wrong, It's not you, it's us. Please try again later."
          );
        } else {
          $("#register-alert").text(res.responseJSON.message);
        }
        $("#register-alert").show();
        $("#register-button").attr("disabled", false);
      }
    }).done(res => {
      console.log(res.responseJSON);
      $("#register-form").hide();
      $("#register-alert").addClass("alert-success");
      $("#register-alert").removeClass("alert-danger");
      $("#register-alert").text(
        "Registeration Successful, please verify your email by following the link sent"
      );
      $("#register-alert").show();
    });
  });
});
