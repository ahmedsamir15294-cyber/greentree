/* ==================================================
   GREENTREE ADMIN DASHBOARD
================================================== */

const DASHBOARD_API = "http://localhost:8080/api/dashboard";


/* ==================================================
   LOAD DASHBOARD
================================================== */

async function loadDashboard() {

    const totalUsers =
        document.getElementById("totalUsers");

    const totalOrders =
        document.getElementById("totalOrders");

    const totalRevenue =
        document.getElementById("totalRevenue");

    const growth =
        document.getElementById("growth");


    try {

        const response =
            await fetch(DASHBOARD_API, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });


        if (!response.ok) {

            throw new Error(
                `Dashboard API Error: ${response.status}`
            );

        }


        const dashboard =
            await response.json();


        console.log(
            "Dashboard data:",
            dashboard
        );


        /* ================= STATISTICS ================= */

        updateStatistics(dashboard);


        /* ================= ACTIVITY ================= */

        loadActivity(
            dashboard.recentActivity
        );


        /* ================= RECENT ORDERS ================= */

        loadRecentOrders(
            dashboard.recentOrders
        );


    } catch (error) {

        console.error(
            "Failed to load dashboard:",
            error
        );


        showDashboardError();

    }

}


/* ==================================================
   STATISTICS
================================================== */

function updateStatistics(dashboard) {

    const totalUsers =
        document.getElementById("totalUsers");

    const totalOrders =
        document.getElementById("totalOrders");

    const totalRevenue =
        document.getElementById("totalRevenue");

    const growth =
        document.getElementById("growth");


    /* ================= USERS ================= */

    if (totalUsers) {

        totalUsers.textContent =
            formatNumber(
                dashboard.totalUsers
            );

    }


    /* ================= ORDERS ================= */

    if (totalOrders) {

        totalOrders.textContent =
            formatNumber(
                dashboard.totalOrders
            );

    }


    /* ================= REVENUE ================= */

    if (totalRevenue) {

        totalRevenue.textContent =
            formatCurrency(
                dashboard.totalRevenue
            );

    }


    /* ================= GROWTH ================= */

    if (growth) {

        const growthValue =
            Number(
                dashboard.growth
            );


        if (Number.isFinite(growthValue)) {

            growth.textContent =
                `${growthValue >= 0 ? "+" : ""}${growthValue}%`;

        } else {

            growth.textContent = "--";

        }

    }

}


/* ==================================================
   FORMAT NUMBER
================================================== */

function formatNumber(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "--";

    }


    return number.toLocaleString(
        "en-US"
    );

}


/* ==================================================
   FORMAT CURRENCY
================================================== */

function formatCurrency(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "$--";

    }


    return "$" +
        number.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* ==================================================
   ACTIVITY
================================================== */

function loadActivity(activities) {

    const activityList =
        document.getElementById(
            "activityList"
        );


    if (!activityList) {

        console.warn(
            "activityList element not found."
        );

        return;

    }


    activityList.innerHTML = "";


    /* ================= EMPTY ================= */

    if (
        !Array.isArray(activities) ||
        activities.length === 0
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

        return;

    }


    /* ================= ACTIVITIES ================= */

    activities.forEach(
        function (activity) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "activity-item";


            const icon =
                getActivityIcon(
                    activity.type
                );


            const message =
                escapeHTML(
                    activity.message ||
                    "Activity"
                );


            const time =
                escapeHTML(
                    activity.time ||
                    "Recently"
                );


            item.innerHTML = `

                <div class="activity-icon">
                    ${icon}
                </div>

                <div class="activity-content">

                    <p class="activity-message">
                        ${message}
                    </p>

                    <p class="activity-time">
                        ${time}
                    </p>

                </div>

            `;


            activityList.appendChild(
                item
            );

        }
    );

}


/* ==================================================
   ACTIVITY ICON
================================================== */

function getActivityIcon(type) {

    switch (
        String(type).toLowerCase()
    ) {

        case "user":
            return "U";

        case "order":
            return "O";

        case "payment":
            return "$";

        case "profile":
            return "P";

        default:
            return "G";

    }

}


/* ==================================================
   RECENT ORDERS
================================================== */

function loadRecentOrders(orders) {

    const ordersTableBody =
        document.getElementById(
            "ordersTableBody"
        );


    if (!ordersTableBody) {

        console.warn(
            "ordersTableBody element not found."
        );

        return;

    }


    ordersTableBody.innerHTML = "";


    /* ================= EMPTY ================= */

    if (
        !Array.isArray(orders) ||
        orders.length === 0
    ) {

        ordersTableBody.innerHTML = `

            <tr>

                <td colspan="5">
                    No recent orders.
                </td>

            </tr>

        `;

        return;

    }


    /* ================= ORDERS ================= */

    orders.forEach(
        function (order) {

            const row =
                document.createElement(
                    "tr"
                );


            const status =
                order.status ||
                "Unknown";


            const statusClass =
                getOrderStatusClass(
                    status
                );


            const orderId =
                escapeHTML(
                    String(
                        order.id ?? ""
                    )
                );


            const customer =
                escapeHTML(
                    order.customer ||
                    "Unknown"
                );


            const product =
                escapeHTML(
                    order.product ||
                    "Unknown"
                );


            const amount =
                formatCurrency(
                    order.amount
                );


            row.innerHTML = `

                <td class="order-id">
                    #${orderId}
                </td>

                <td class="customer-name">
                    ${customer}
                </td>

                <td>
                    ${product}
                </td>

                <td class="order-amount">
                    ${amount}
                </td>

                <td>

                    <span
                        class="order-status ${statusClass}"
                    >
                        ${escapeHTML(status)}
                    </span>

                </td>

            `;


            ordersTableBody.appendChild(
                row
            );

        }
    );

}


/* ==================================================
   ORDER STATUS
================================================== */

function getOrderStatusClass(status) {

    switch (
        String(status).toLowerCase()
    ) {

        case "completed":
            return "status-completed";

        case "pending":
            return "status-pending";

        case "cancelled":
            return "status-cancelled";

        default:
            return "";

    }

}


/* ==================================================
   HTML ESCAPE
================================================== */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==================================================
   MOBILE MENU
================================================== */

function setupMobileMenu() {

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


    if (
        !menuBtn ||
        !sidebar
    ) {

        return;

    }


    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );


            if (sidebarOverlay) {

                sidebarOverlay.classList.toggle(
                    "show"
                );

            }

        }
    );


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

}


/* ==================================================
   LOGOUT
================================================== */

function logout() {

    const confirmLogout =
        window.confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    window.location.href =
        "../../index.html";

}


/* ==================================================
   ERROR STATE
================================================== */

function showDashboardError() {

    const totalUsers =
        document.getElementById(
            "totalUsers"
        );


    const totalOrders =
        document.getElementById(
            "totalOrders"
        );


    const totalRevenue =
        document.getElementById(
            "totalRevenue"
        );


    const growth =
        document.getElementById(
            "growth"
        );


    const activityList =
        document.getElementById(
            "activityList"
        );


    if (totalUsers) {

        totalUsers.textContent =
            "--";

    }


    if (totalOrders) {

        totalOrders.textContent =
            "--";

    }


    if (totalRevenue) {

        totalRevenue.textContent =
            "$--";

    }


    if (growth) {

        growth.textContent =
            "--";

    }


    if (activityList) {

        activityList.innerHTML = `

            <div class="activity-item">

                <div class="activity-icon">
                    !
                </div>

                <div class="activity-content">

                    <p class="activity-message">
                        Unable to load dashboard data
                    </p>

                    <p class="activity-time">
                        Please check the backend server.
                    </p>

                </div>

            </div>

        `;

    }

}


/* ==================================================
   START DASHBOARD
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupMobileMenu();

        loadDashboard();

    }
);