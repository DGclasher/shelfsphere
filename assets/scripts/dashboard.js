const baseUrl = "https://shelfsphere.pythonanywhere.com/api";

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
  }
});
if (localStorage.getItem("group_id") == 1) {
  document.getElementById("memberList").style = "block";
}

function createListItem(data, targetElement, endpoint) {
  const listItem = document.createElement("div");
  listItem.className =
    "flex items-center justify-between p-4 bg-gray-800 mb-2 rounded";

  const textContainer = document.createElement("div");
  textContainer.className = "flex-1";

  const title = document.createElement("h2");
  title.className = "text-xl font-semibold mb-1";
  title.textContent = data.title || data.user;

  textContainer.appendChild(title);
  listItem.appendChild(textContainer);

  const actionsContainer = document.createElement("div");
  actionsContainer.className = "flex space-x-2";

  const editButton = document.createElement("button");
  editButton.className =
    "bg-blue-500 px-2 py-1 rounded text-white hover:bg-blue-600";
  editButton.textContent = "Edit";
  editButton.setAttribute("data-id", data.id);
  editButton.setAttribute("endpoint", endpoint);
  editButton.classList.add("edit-button");

  const deleteButton = document.createElement("button");
  deleteButton.className =
    "bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600";
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.setAttribute("data-id", data.id);
  deleteButton.setAttribute("endpoint", endpoint);

  actionsContainer.appendChild(editButton);
  actionsContainer.appendChild(deleteButton);
  listItem.appendChild(actionsContainer);

  targetElement.appendChild(listItem);
}

// Function to fetch and display data
async function fetchDataAndDisplay(endpoint, targetElement) {
  const token = localStorage.getItem("token");
  const response = await fetch(baseUrl + endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status == 200) {
    const data = await response.json();
    data.forEach((item) => {
      createListItem(item, targetElement, endpoint);
    });
  }
}

// Fetch and display book data and members
if (localStorage.getItem("group_id") == 1) {
  fetchDataAndDisplay("/books/", document.getElementById("bookList"));
  fetchDataAndDisplay("/members/", document.getElementById("memberList"));
}

async function handleDeleteButtonClick(event) {
  const targetButton = event.target;
  const id = targetButton.getAttribute("data-id");
  const endpoint = targetButton.getAttribute("endpoint") + id + "/";
  try {
    const response = await fetch(baseUrl + endpoint, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  } catch (error) {
    console.log(error);
  }
}

async function handleEditButtonClick(event) {
  const targetButton = event.target;
  const id = targetButton.getAttribute("data-id");
  const endPoint = targetButton.getAttribute("endpoint");
  const editUrl = `/pages/edit-${
    endPoint.split("/")[1]
  }.html?endpoint=${baseUrl}${endPoint}&id=${id}`;
  window.location.href = editUrl;
}

document.addEventListener("click", (event) => {
  if (event.target.matches(".delete-button")) {
    handleDeleteButtonClick(event);
    window.location.replace(window.location.href);
  }
});
document.addEventListener("click", (event) => {
  if (event.target.matches(".edit-button")) {
    handleEditButtonClick(event);
  }
});

// Functions for member
function createBookElement(data, targetElement, endpoint) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("mb-4");

  const bookTitle = document.createElement("span");
  bookTitle.textContent = data.title;
  bookTitle.classList.add("text-white", "text-lg");
  bookElement.appendChild(bookTitle);

  const bookAuthor = document.createElement("span");
  bookAuthor.textContent = ` by ${data.author}`;
  bookAuthor.classList.add("text-gray-400");
  bookElement.appendChild(bookAuthor);

  const actionButton = document.createElement("button");
  actionButton.textContent = data.is_available ? "Borrow" : "Return";
  actionButton.classList.add(
    "bg-blue-500",
    "text-white",
    "px-4",
    "py-2",
    "rounded-full",
    "hover:bg-blue-600",
    "ml-4"
  );
  actionButton.setAttribute("book-id", data.id);
  actionButton.setAttribute(
    "endpoint",
    data.is_available ? "/books/borrow/" : "/books/return/"
  );
  actionButton.classList.add("members-action");
  bookElement.appendChild(actionButton);
  targetElement.appendChild(bookElement);
}

async function fetchMemberDataDisplay(endpoint, targetElement) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(baseUrl + endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status == 200) {
      const data = await response.json();
      data.forEach((item) => {
        createBookElement(item, targetElement, endpoint);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// Fetch view for all books
if (localStorage.getItem("group_id") == 2) {
  fetchMemberDataDisplay(
    "/books/view/all",
    document.getElementById("allBooks")
  );
  fetchMemberDataDisplay(
    "/books/view/borrowed",
    document.getElementById("borrowedBooks")
  );
}

async function handleBorrowReturn(event) {
  const targetButton = event.target;
  const id = parseInt(targetButton.getAttribute("book-id"));
  const endpoint = targetButton.getAttribute("endpoint");
  const token = localStorage.getItem("token");

  try {
    const data = { book_ids: [id] };
    const response = await fetch(baseUrl + endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("click", (event) => {
  if (event.target.matches(".members-action")) {
    handleBorrowReturn(event);
    window.location.replace(window.location.href);
  }
});
