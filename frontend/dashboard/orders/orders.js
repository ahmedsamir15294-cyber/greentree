/* ================= LOAD ORDERS ================= */

async function loadOrders() {

    const ordersList =
        document.getElementById("ordersList");


    try {

        const response = await fetch(
            "http://localhost:8080/api/orders"
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const orders = await response.json();


        console.log(
            "Orders from Go:",
            orders
        );


        ordersList.innerHTML = "";


        /* ================= NO ORDERS ================= */

        if (
            !orders ||
            orders.length === 0
        ) {

            ordersList.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:40px;
                            color:#8fa6c1;
                        "
                    >
                        No orders found
                    </td>

                </tr>

            `;

            return;
        }


        /* ================= CREATE ORDERS ================= */

        orders.forEach(order => {


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <!-- ORDER -->

                <td>

                    <span class="order-id">
                        #${order.id}
                    </span>

                </td>


                <!-- CUSTOMER -->

                <td>

                    <span class="customer-name">
                        ${order.customer}
                    </span>

                </td>


                <!-- PRODUCT -->

                <td>

                    <span class="order-product">
                        ${order.product}
                    </span>

                </td>


                <!-- AMOUNT -->

                <td>

                    <span class="order-amount">

                        $${Number(
                            order.amount
                        ).toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </span>

                </td>


                <!-- STATUS -->

                <td>

                    <span
                        class="
                            order-status
                            ${getStatusClass(
                                order.status
                            )}
                        "
                    >

                        ${order.status}

                    </span>

                </td>


                <!-- ACTION -->

                <td>

                    <button
                        class="order-action"
                        onclick="viewOrder(${order.id})"
                    >
                        View
                    </button>

                </td>

            `;


            ordersList.appendChild(row);

        });


    } catch (error) {


        console.error(
            "Failed to load orders:",
            error
        );


        ordersList.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="orders-error"
                >
                    Failed to load orders
                </td>

            </tr>

        `;

    }

}


/* ================= STATUS ================= */

function getStatusClass(status) {


    switch (status) {


        case "Completed":

            return "status-completed";


        case "Pending":

            return "status-pending";


        case "Cancelled":

            return "status-cancelled";


        default:

            return "";

    }

}


/* ================= VIEW ORDER ================= */

async function viewOrder(orderId) {


    try {


        const response = await fetch(
            "http://localhost:8080/api/orders"
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const orders =
            await response.json();


        const order =
            orders.find(
                item => item.id === orderId
            );


        if (!order) {

            alert("Order not found");

            return;

        }


        /* ================= FILL MODAL ================= */

        document.getElementById(
            "modalOrderTitle"
        ).textContent =
            "Order #" + order.id;


        document.getElementById(
            "modalOrderId"
        ).textContent =
            "#" + order.id;


        document.getElementById(
            "modalCustomer"
        ).textContent =
            order.customer;


        document.getElementById(
            "modalProduct"
        ).textContent =
            order.product;


        document.getElementById(
            "modalAmount"
        ).textContent =
            "$" +
            Number(
                order.amount
            ).toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


        const statusElement =
            document.getElementById(
                "modalStatus"
            );


        statusElement.textContent =
            order.status;


        statusElement.className =
            "order-status " +
            getStatusClass(
                order.status
            );


        /* ================= OPEN MODAL ================= */

        document
            .getElementById("orderModal")
            .classList
            .add("active");


    } catch (error) {


        console.error(
            "Failed to load order:",
            error
        );


        alert(
            "Failed to load order details"
        );

    }

}


/* ================= CLOSE MODAL ================= */

function closeOrderModal() {

    document
        .getElementById("orderModal")
        .classList
        .remove("active");

}


/* ================= CLOSE BY BACKGROUND ================= */

document
    .getElementById("orderModal")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target === this
            ) {

                closeOrderModal();

            }

        }
    );


/* ================= CLOSE WITH ESC ================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeOrderModal();

        }

    }
);


/* ================= START ================= */

loadOrders();