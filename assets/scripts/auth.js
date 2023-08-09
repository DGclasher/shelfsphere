const baseUrl = "https://shelfsphere.pythonanywhere.com/auth";
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    data = { username: username, password: password };
    try {
      const response = await fetch(baseUrl + "/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("group_id");
      if (response.status == 200) {
        const responseData = await response.json();
        localStorage.setItem("token", responseData.access_token);
        localStorage.setItem("user_id", responseData.user_id);
        localStorage.setItem('group_id',responseData.group_id)
        window.location.href = "dashboard.html"
      } else if (response.status == 403) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username-register").value;
    const password = document.getElementById("password-register").value;
    const roleSelect = document.getElementById("role");
    const selected = roleSelect.options[roleSelect.selectedIndex].value;
    try {
      const data = { username: username, password: password, role: selected };
      const response = await fetch(baseUrl + "/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      });
      if (response.status == 200) {
        console.log("User registered");
        window.location.href = "login.html"
      }
    } catch (error) {
      console.log(error);
    }
  });
}
