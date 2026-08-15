/* ================= LOAD USER ================= */

async function loadSettings() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/user"
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const user = await response.json();


        console.log("User settings:", user);


        document.getElementById("name").value =
            user.name || "";


        document.getElementById("username").value =
            user.username || "";


        document.getElementById("email").value =
            user.email || "";


        document.getElementById("phone").value =
            user.phone || "";


    } catch (error) {

        console.error(
            "Failed to load user settings:",
            error
        );

    }

}


/* ================= SAVE SETTINGS ================= */

async function saveSettings() {

    const name =
        document.getElementById("name").value.trim();


    const username =
        document.getElementById("username").value.trim();


    const email =
        document.getElementById("email").value.trim();


    const phone =
        document.getElementById("phone").value.trim();


    if (!name || !username || !email) {

        alert(
            "Please fill in Name, Username and Email."
        );

        return;

    }


    try {

        const response = await fetch(
            "http://localhost:8080/api/user",
            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    name: name,

                    username: username,

                    email: email,

                    phone: phone

                })

            }
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const updatedUser =
            await response.json();


        console.log(
            "Updated user:",
            updatedUser
        );


        alert(
            "Account settings saved successfully."
        );


    } catch (error) {

        console.error(
            "Failed to save settings:",
            error
        );


        alert(
            "Failed to save settings."
        );

    }

}


/* ================= CHANGE PASSWORD ================= */

function changePassword() {

    const currentPassword =
        document.getElementById(
            "currentPassword"
        ).value;


    const newPassword =
        document.getElementById(
            "newPassword"
        ).value;


    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value;


    if (!currentPassword ||
        !newPassword ||
        !confirmPassword) {

        alert(
            "Please fill in all password fields."
        );

        return;

    }


    if (newPassword !== confirmPassword) {

        alert(
            "New passwords do not match."
        );

        return;

    }


    if (newPassword.length < 6) {

        alert(
            "Password must be at least 6 characters."
        );

        return;

    }


    /*
        Password API is not connected yet.

        For now we only validate the form.
    */

    alert(
        "Password validation successful. Password API will be connected later."
    );


    document.getElementById(
        "currentPassword"
    ).value = "";


    document.getElementById(
        "newPassword"
    ).value = "";


    document.getElementById(
        "confirmPassword"
    ).value = "";

}


/* ================= SAVE PREFERENCES ================= */

function savePreferences() {

    const emailNotifications =
        document.getElementById(
            "emailNotifications"
        ).checked;


    const orderNotifications =
        document.getElementById(
            "orderNotifications"
        ).checked;


    const stockNotifications =
        document.getElementById(
            "stockNotifications"
        ).checked;


    const preferences = {

        emailNotifications,

        orderNotifications,

        stockNotifications

    };


    localStorage.setItem(
        "greenTreePreferences",
        JSON.stringify(preferences)
    );


    alert(
        "Preferences saved successfully."
    );

}


/* ================= LOAD PREFERENCES ================= */

function loadPreferences() {

    const saved =
        localStorage.getItem(
            "greenTreePreferences"
        );


    if (!saved) {

        return;

    }


    try {

        const preferences =
            JSON.parse(saved);


        document.getElementById(
            "emailNotifications"
        ).checked =
            preferences.emailNotifications;


        document.getElementById(
            "orderNotifications"
        ).checked =
            preferences.orderNotifications;


        document.getElementById(
            "stockNotifications"
        ).checked =
            preferences.stockNotifications;


    } catch (error) {

        console.error(
            "Failed to load preferences:",
            error
        );

    }

}


/* ================= LOGOUT ================= */

function logout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {

        return;

    }


    /*
        Authentication system is not connected yet.
        For now return to the main website.
    */

    window.location.href =
        "../../index.html";

}


/* ================= START ================= */

loadSettings();

loadPreferences();