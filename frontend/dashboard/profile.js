let user = {};


/* ================= ELEMENTS ================= */

const editBtn = document.getElementById("editBtn");
const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editPhone = document.getElementById("editPhone");


/* ================= GET USER ================= */

async function loadUser() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/user"
        );

        if (!response.ok) {
            throw new Error("Failed to load user");
        }

        user = await response.json();

        displayUser();

    } catch (error) {

        console.error("Error:", error);

        alert("Could not connect to Go backend.");
    }
}


/* ================= DISPLAY USER ================= */

function displayUser() {

    document.getElementById("userName").textContent =
        user.name;

    document.getElementById("userUsername").textContent =
        "@" + user.username;


    document.getElementById("fullName").textContent =
        user.name;

    document.getElementById("username").textContent =
        user.username;

    document.getElementById("email").textContent =
        user.email;

    document.getElementById("phone").textContent =
        user.phone;

    document.getElementById("role").textContent =
        user.role;

    document.getElementById("createdAt").textContent =
        user.createdAt;


    const firstLetter =
        user.name.charAt(0).toUpperCase();


    document.getElementById("avatarLetter").textContent =
        firstLetter;

    document.getElementById("topAvatar").textContent =
        firstLetter;

    document.getElementById("topName").textContent =
        user.name;

    document.getElementById("topUsername").textContent =
        "@" + user.username;
}


/* ================= EDIT ================= */

editBtn.addEventListener("click", function () {

    editName.value = user.name;

    editEmail.value = user.email;

    editPhone.value = user.phone;

    editModal.classList.remove("hidden");
});


/* ================= CLOSE ================= */

closeModal.addEventListener("click", function () {

    editModal.classList.add("hidden");
});


cancelBtn.addEventListener("click", function () {

    editModal.classList.add("hidden");
});


/* ================= UPDATE USER ================= */

saveBtn.addEventListener("click", async function () {

    const newName = editName.value.trim();

    const newEmail = editEmail.value.trim();

    const newPhone = editPhone.value.trim();


    if (
        newName === "" ||
        newEmail === "" ||
        newPhone === ""
    ) {

        alert("Please fill all fields.");

        return;
    }


    const updatedUser = {

        id: user.id,

        name: newName,

        username: user.username,

        email: newEmail,

        phone: newPhone,

        role: user.role,

        createdAt: user.createdAt
    };


    try {

        const response = await fetch(
            "http://localhost:8080/api/user",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedUser)
            }
        );


        if (!response.ok) {

            throw new Error("Failed to update user");
        }


        user = await response.json();


        displayUser();


        editModal.classList.add("hidden");


        alert("Profile updated successfully.");


    } catch (error) {

        console.error("Error:", error);

        alert("Could not update profile.");
    }
});


/* ================= LOGOUT ================= */

logoutBtn.addEventListener("click", function () {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (confirmLogout) {

        alert("Logout will be connected to Go backend next.");
    }
});


/* ================= CLOSE MODAL OUTSIDE ================= */

editModal.addEventListener("click", function (event) {

    if (event.target === editModal) {

        editModal.classList.add("hidden");
    }
});


/* ================= LOAD ================= */

loadUser();