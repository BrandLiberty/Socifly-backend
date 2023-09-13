
const fileInput = document.querySelector('input[type="file"]');
const previewContainer = document.getElementById('uploaded-images');
const customCategoryInput = document.getElementById('customCategorys');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const categorySelect = document.getElementById('category');

addCategoryBtn.addEventListener('click', function () {
    const customCategory = customCategoryInput.value.trim();
    if (customCategory) {
        const option = document.createElement('option');
        option.value = customCategory;
        option.textContent = customCategory;
        categorySelect.appendChild(option);
        customCategoryInput.value = ''; // Clear the input
    }
});

fileInput.addEventListener('change', function () {
    // Clear any previous previews
    previewContainer.innerHTML = '';

    const files = fileInput.files;
    for (const file of files) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            previewContainer.appendChild(img);
        };

        reader.readAsDataURL(file);
    }
});

