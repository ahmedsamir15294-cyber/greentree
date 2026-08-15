/* ================= LOAD PRODUCTS ================= */

async function loadProducts() {

    const productsList = document.getElementById("productsList");

    try {

        const response = await fetch(
            "http://localhost:8080/api/products"
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const products = await response.json();


        console.log("Products from Go:", products);


        productsList.innerHTML = "";


        products.forEach(product => {

            const row = document.createElement("tr");


            row.innerHTML = `

                <td>

                    <span class="product-id">
                        #${product.id}
                    </span>

                </td>


                <td>

                    <span class="product-name">
                        ${product.name}
                    </span>

                </td>


                <td>

                    <span class="product-category">
                        ${product.category}
                    </span>

                </td>


                <td>

                    <span class="product-price">

                        $${Number(product.price).toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </span>

                </td>


                <td>

                    <span class="product-stock">
                        ${product.stock}
                    </span>

                </td>


                <td>

                    <span class="product-status ${getProductStatusClass(product.status)}">

                        ${product.status}

                    </span>

                </td>


                <td>

                    <button
                        class="product-action"
                        onclick="viewProduct(${product.id})"
                    >

                        View

                    </button>

                </td>

            `;


            productsList.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Failed to load products:",
            error
        );


        productsList.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#ff6b6b;
                    "
                >

                    Failed to load products

                </td>

            </tr>

        `;

    }

}


/* ================= STATUS CLASS ================= */

function getProductStatusClass(status) {

    if (status === "Active") {

        return "status-active";

    }


    if (status === "Low Stock") {

        return "status-low";

    }


    if (status === "Inactive") {

        return "status-inactive";

    }


    return "";

}


/* ================= VIEW PRODUCT ================= */

async function viewProduct(productId) {

    try {

        const response = await fetch(
            "http://localhost:8080/api/products"
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const products = await response.json();


        const product = products.find(
            item => Number(item.id) === Number(productId)
        );


        if (!product) {

            alert("Product not found");

            return;

        }


        document.getElementById(
            "modalProductName"
        ).textContent = product.name;


        document.getElementById(
            "modalProductId"
        ).textContent = "#" + product.id;


        document.getElementById(
            "modalProductCategory"
        ).textContent = product.category;


        document.getElementById(
            "modalProductPrice"
        ).textContent =
            "$" +
            Number(product.price).toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


        document.getElementById(
            "modalProductStock"
        ).textContent = product.stock;


        document.getElementById(
            "modalProductStatus"
        ).textContent = product.status;


        document
            .getElementById("productModal")
            .classList.add("show");


    } catch (error) {

        console.error(
            "Failed to load product:",
            error
        );

        alert("Failed to load product");

    }

}


/* ================= CLOSE MODAL ================= */

function closeProductModal() {

    document
        .getElementById("productModal")
        .classList.remove("show");

}


/* ================= CLOSE BY BACKGROUND ================= */

document
    .getElementById("productModal")
    .addEventListener("click", function (event) {

        if (event.target === this) {

            closeProductModal();

        }

    });


/* ================= CLOSE WITH ESC ================= */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeProductModal();

    }

});


/* ================= START ================= */

loadProducts();