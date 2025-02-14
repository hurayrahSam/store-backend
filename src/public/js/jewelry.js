console.log("Products frontend javascript file");
$(function () {

    $("#process-btn").on("click", () => {
        $(".dish-container").slideToggle(500);
        $("#process-btn").css("display", "none");
    });

    $("#cancel-btn").on("click", () => {
        $(".dish-container").slideToggle(300);
        $("#process-btn").css("display", "flex");
    });

    $(".new-product-status").on("change", async function (e) {
        const id = e.target.id,
            jewelryStatus = $(`#${id}.new-product-status`).val();

        try {
            const response = await axios.post(`/owner/jewelry/update-jewelry/${id}`, {
                jewelryStatus: jewelryStatus,
            });
            console.log("response:", response);
            const result = response.data;
            if (result.data) {
                $(".update-btn").blur();
            } else alert(" Product update failed!");
        } catch (err) {
            console.log(err);
            alert(" Product update failed!");
        }
    });
});
function validateForm() {
    const jewelryName = $(".product-name").val(),
        jewelryPrice = $(".product-price").val(),
        jewelryLeftCount = $(".product-left-count").val(),
        jewelryType = $(".product-collection").val(),
        jewelryGender = $(".product-gender").val(),
        jewelryMaterial = $(".product-material").val(),
        jewelryLength = $(".product-length").val(),
        jewelrySize = $(".product-size").val(),
        jewelryDetail = $(".product-detail").val(),
        productDesc = $(".product-desc").val(),
        productStatus = $(".product-status").val();
    if (
        jewelryName === "" ||
        jewelryPrice === "" ||
        jewelryLeftCount === "" ||
        jewelryType === "" ||
        jewelryGender === "" ||
        jewelryMaterial === "" ||
        jewelryDetail === "" ||
        productDesc === "" ||
        productStatus === ""

    ) {
        alert("Please insert all details!");
        return false;
    } else return true;
}

function previewFileHandler(input, order) {
    const imgClassName = input.className;
    console.log("input:", input);

    const file = $(`.${imgClassName}`).get(0).files[0];
    const fileType = file["type"];
    const validImageType = ["image/jpg", "image/jpeg", "image/png"];

    if (!validImageType.includes(fileType)) {
        alert("Please insert only jpeg, jpg and png!");
    } else {
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                $(`#image-section-${order}`).attr("src", reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
}
