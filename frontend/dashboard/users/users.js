/* =========================================================
   GREEN TREE - USERS MANAGEMENT
========================================================= */


/* ===============================
   ELEMENTS
================================ */

const usersList =
    document.getElementById("usersList");


const userModal =
    document.getElementById("userModal");


const editModal =
    document.getElementById("editModal");


const closeModal =
    document.getElementById("closeModal");


const modalCloseButton =
    document.getElementById("modalCloseButton");


const closeEditModal =
    document.getElementById("closeEditModal");


const cancelEdit =
    document.getElementById("cancelEdit");


const editUserForm =
    document.getElementById("editUserForm");


const editMessage =
    document.getElementById("editMessage");


/* ===============================
   USERS DATA
================================ */

let users = [];


/* ===============================
   LOAD USERS
================================ */

async function loadUsers() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/users"
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load users"
            );

        }


        users = await response.json();


        displayUsers(users);


    } catch (error) {

        console.error(
            "Users error:",
            error
        );

    }

}


/* ===============================
   DISPLAY USERS
================================ */

function displayUsers(usersData) {

    if (!usersList) {
        return;
    }


    usersList.innerHTML = "";


    usersData.forEach(user => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="user-id">
                    #${user.id}
                </span>

            </td>


            <td>

                <span class="user-name">
                    ${user.name}
                </span>

            </td>


            <td>

                <span class="username">
                    @${user.username}
                </span>

            </td>


            <td>

                <span class="user-email">
                    ${user.email}
                </span>

            </td>


            <td>

                <span class="role-badge">
                    ${user.role}
                </span>

            </td>


            <td>

                <span class="status-badge">
                    ${user.status}
                </span>

            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="view-user-btn"
                        type="button"
                        data-id="${user.id}"
                    >
                        View
                    </button>


                    <button
                        class="edit-user-btn"
                        type="button"
                        data-id="${user.id}"
                    >
                        Edit
                    </button>

                </div>

            </td>

        `;


        usersList.appendChild(row);

    });


    /* ===============================
       VIEW BUTTONS
    ================================ */

    document
        .querySelectorAll(".view-user-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    const selectedUser =
                        users.find(
                            user =>
                                user.id === id
                        );


                    if (selectedUser) {

                        openUserModal(
                            selectedUser
                        );

                    }

                }
            );

        });


    /* ===============================
       EDIT BUTTONS
    ================================ */

    document
        .querySelectorAll(".edit-user-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    const selectedUser =
                        users.find(
                            user =>
                                user.id === id
                        );


                    if (selectedUser) {

                        openEditModal(
                            selectedUser
                        );

                    }

                }
            );

        });

}


/* =========================================================
   VIEW USER
========================================================= */

function openUserModal(user) {

    document.getElementById(
        "modalAvatar"
    ).textContent =
        getInitial(user.name);


    document.getElementById(
        "modalName"
    ).textContent =
        user.name;


    document.getElementById(
        "modalUsername"
    ).textContent =
        "@" + user.username;


    document.getElementById(
        "modalId"
    ).textContent =
        "#" + user.id;


    document.getElementById(
        "modalEmail"
    ).textContent =
        user.email;


    document.getElementById(
        "modalPhone"
    ).textContent =
        user.phone || "Not provided";


    document.getElementById(
        "modalRole"
    ).textContent =
        user.role;


    document.getElementById(
        "modalStatus"
    ).textContent =
        user.status;


    document.getElementById(
        "modalCreatedAt"
    ).textContent =
        user.createdAt || "Unknown";


    userModal.classList.add(
        "active"
    );

}


/* =========================================================
   EDIT USER
========================================================= */

function openEditModal(user) {

    document.getElementById(
        "editUserId"
    ).value =
        user.id;


    document.getElementById(
        "editName"
    ).value =
        user.name;


    document.getElementById(
        "editEmail"
    ).value =
        user.email;


    document.getElementById(
        "editPhone"
    ).value =
        user.phone || "";


    document.getElementById(
        "editRole"
    ).value =
        user.role;


    document.getElementById(
        "editStatus"
    ).value =
        user.status;


    editMessage.textContent = "";

    editMessage.className =
        "edit-message";


    editModal.classList.add(
        "active"
    );

}


/* =========================================================
   SAVE USER
========================================================= */

editUserForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            Number(
                document.getElementById(
                    "editUserId"
                ).value
            );


        const updatedUser = {

            name:
                document.getElementById(
                    "editName"
                ).value.trim(),

            email:
                document.getElementById(
                    "editEmail"
                ).value.trim(),

            phone:
                document.getElementById(
                    "editPhone"
                ).value.trim(),

            role:
                document.getElementById(
                    "editRole"
                ).value,

            status:
                document.getElementById(
                    "editStatus"
                ).value

        };


        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/users/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedUser
                            )
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to update user"
                );

            }


            const updated =
                await response.json();


            /* ===============================
               UPDATE LOCAL DATA
            ================================ */

            users =
                users.map(user => {

                    if (user.id === updated.id) {

                        return updated;

                    }

                    return user;

                });


            /* ===============================
               UPDATE TABLE
            ================================ */

            displayUsers(users);


            /* ===============================
               SUCCESS MESSAGE
            ================================ */

            editMessage.textContent =
                "User updated successfully.";

            editMessage.className =
                "edit-message success";


            /* ===============================
               CLOSE AFTER SHORT DELAY
            ================================ */

            setTimeout(() => {

                closeEditUserModal();

            }, 700);


        } catch (error) {

            console.error(
                "Update user error:",
                error
            );


            editMessage.textContent =
                "Failed to update user.";

            editMessage.className =
                "edit-message error";

        }

    }
);


/* =========================================================
   CLOSE VIEW MODAL
========================================================= */

function closeUserModal() {

    userModal.classList.remove(
        "active"
    );

}


/* =========================================================
   CLOSE EDIT MODAL
========================================================= */

function closeEditUserModal() {

    editModal.classList.remove(
        "active"
    );

}


/* ===============================
   VIEW CLOSE BUTTONS
================================ */

closeModal.addEventListener(
    "click",
    closeUserModal
);


modalCloseButton.addEventListener(
    "click",
    closeUserModal
);


/* ===============================
   EDIT CLOSE BUTTONS
================================ */

closeEditModal.addEventListener(
    "click",
    closeEditUserModal
);


cancelEdit.addEventListener(
    "click",
    closeEditUserModal
);


/* ===============================
   CLICK OUTSIDE VIEW
================================ */

userModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === userModal
        ) {

            closeUserModal();

        }

    }
);


/* ===============================
   CLICK OUTSIDE EDIT
================================ */

editModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === editModal
        ) {

            closeEditUserModal();

        }

    }
);


/* ===============================
   ESCAPE KEY
================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeUserModal();

            closeEditUserModal();

        }

    }
);


/* ===============================
   INITIAL
================================ */

function getInitial(name) {

    if (!name) {

        return "U";

    }


    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


/* ===============================
   START
================================ */

loadUsers();