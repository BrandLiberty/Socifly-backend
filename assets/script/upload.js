// const fileInput = document.querySelector('input[type="file"]');
const previewContainer = document.getElementById('uploaded-images');
const customCategoryInput = document.getElementById('customCategorys');
const categorySelect = document.getElementById('category');


// fileInput.addEventListener('change', function () {
//     // Clear any previous previews
//     previewContainer.innerHTML = '';

//     const files = fileInput.files;
//     for (const file of files) {
//         const reader = new FileReader();

//         reader.onload = function (e) {
//             const img = document.createElement('img');
//             img.src = e.target.result;
//             img.className = 'preview-image';
//             previewContainer.appendChild(img);
//         };

//         reader.readAsDataURL(file);
//     }
// });

// Adding delete Button for category
function deleteCategory(id){
    console.log('Delete cat id',id)
}

$('#deleteCategoryBtns').on('click',(e)=>{
    $('.mngCat').toggle()
})