/* ==================================================
   DASHBOARD
================================================== */


/* ================= LOAD DASHBOARD ================= */

async function loadDashboard() {

    const totalUsers =
        document.getElementById("totalUsers");

    const totalOrders =
        document.getElementById("totalOrders");

    const totalRevenue =
        document.getElementById("totalRevenue");


    try {


        /* ================= USERS ================= */

        const usersResponse =
            await fetch(
                "http://localhost:8080/api/users"
            );


        if (!usersResponse.ok) {

            throw new Error(
                "Users API Error: " +
                usersResponse.status
            );

        }


        const users =
            await usersResponse.json();


        console.log(
            "Users from Go:",
            users
        );



        /* ================= ORDERS ================= */

        const ordersResponse =
            await fetch(
                "http://localhost:8080/api/orders"
            );


        if (!ordersResponse.ok) {

            throw new Error(
                "Orders API Error: " +
                ordersResponse.status
            );

        }


        const orders =
            await ordersResponse.json();


        console.log(
            "Orders from Go:",
            orders
        );



        /* ================= TOTAL USERS ================= */

        totalUsers.textContent =
            users.length.toLocaleString("en-US");



        /* ================= TOTAL ORDERS ================= */

        totalOrders.textContent =
            orders.length.toLocaleString("en-US");



        /* ================= REVENUE ================= */

        let revenue = 0;


        orders.forEach(order => {

            if (
                order.status === "Completed"
            ) {

                revenue +=
                    Number(order.amount) || 0;

            }

        });


        totalRevenue.textContent =
            "$" +
            revenue.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );



        /* ================= GROWTH ================= */

        const growth =
            document.getElementById("growth");


        if (growth) {

            growth.textContent =
                "+12.5%";

        }



        /* ================= ACTIVITY ================= */

        loadActivity(
            users,
            orders
        );


    } catch (error) {


        console.error(
            "Failed to load dashboard:",
            error
        );


        totalUsers.textContent =
            "--";


        totalOrders.textContent =
            "--";


        totalRevenue.textContent =
            "$--";


        const growth =
            document.getElementById("growth");


        if (growth) {

            growth.textContent =
                "--";

        }

    }

}



/* ==================================================
   ACTIVITY
================================================== */

function loadActivity(
    users,
    orders
) {

    const activityList =
        document.getElementById(
            "activityList"
        );


    if (!activityList) {
        return;
    }


    activityList.innerHTML = "";



    /* ================= USER ACTIVITY ================= */

    if (
        users &&
        users.length > 0
    ) {

        const user =
            users[users.length - 1];


        const item =
            document.createElement("div");


        item.className =
            "activity-item";


        item.innerHTML = `

            <div class="activity-icon">
                U
            </div>

            <div class="activity-content">

                <p class="activity-message">
                    User registered:
                    ${user.name || "New User"}
                </p>

                <p class="activity-time">
                    Recently
                </p>

            </div>

        `;


        activityList.appendChild(item);

    }



    /* ================= ORDER ACTIVITY ================= */

    if (
        orders &&
        orders.length > 0
    ) {

        const order =
            orders[0];


        const item =
            document.createElement("div");


        item.className =
            "activity-item";


        item.innerHTML = `

            <div class="activity-icon">
                O
            </div>

            <div class="activity-content">

                <p class="activity-message">
                    New order #${order.id}
                    from ${order.customer}
                </p>

                <p class="activity-time">
                    ${order.status}
                </p>

            </div>

        `;


        activityList.appendChild(item);

    }



    /* ================= DEFAULT ACTIVITY ================= */

    if (
        activityList.children.length === 0
    ) {

        activityList.innerHTML = `

            <div class="activity-item">

                <div class="activity-icon">
                    G
                </div>

                <div class="activity-content">

                    <p class="activity-message">
                        Welcome to GreenTree
                    </p>

                    <p class="activity-time">
                        No recent activity
                    </p>

                </div>

            </div>

        `;

    }

}



/* ==================================================
   MOBILE MENU
================================================== */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );


const sidebar =
    document.querySelector(
        ".sidebar"
    );


const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );



if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

            sidebarOverlay.classList.toggle(
                "show"
            );

        }
    );

}



if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        function () {

            sidebar.classList.remove(
                "open"
            );

            sidebarOverlay.classList.remove(
                "show"
            );

        }
    );

}



/* ==================================================
   LOGOUT
================================================== */

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {
        return;
    }


    window.location.href =
        "../../index.html";

}



/* ==================================================
   START DASHBOARD
================================================== */

loadDashboard();