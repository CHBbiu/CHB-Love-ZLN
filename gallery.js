document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const photoGrid = document.getElementById('photoGrid');
    
    // 存储已上传的图片
    let uploadedPhotos = JSON.parse(localStorage.getItem('uploadedPhotos')) || [];

    // 显示已保存的图片
    function displaySavedPhotos() {
        uploadedPhotos.forEach(photo => {
            addPhotoToGrid(photo);
        });
    }

    // 添加图片到网格
    function addPhotoToGrid(photoData) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        
        const img = document.createElement('img');
        img.src = photoData.url;
        
        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';
        overlay.innerHTML = `
            <p>${photoData.date}</p>
            <p class="photo-description">${photoData.description || ''}</p>
            <button class="delete-button" onclick="deletePhoto(this)">×</button>
            <button class="edit-button" onclick="editDescription(this)">✎</button>
        `;
        
        photoItem.appendChild(img);
        photoItem.appendChild(overlay);
        photoGrid.appendChild(photoItem);
    }

    // 处理图片上传
    imageUpload.addEventListener('change', function(e) {
        const files = e.target.files;
        
        for(let file of files) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const description = prompt('请为这张照片添加描述：') || '';
                const photoData = {
                    url: event.target.result,
                    date: new Date().toLocaleDateString(),
                    description: description
                };
                
                uploadedPhotos.push(photoData);
                localStorage.setItem('uploadedPhotos', JSON.stringify(uploadedPhotos));
                addPhotoToGrid(photoData);
            };
            
            reader.readAsDataURL(file);
        }
    });

    // 删除照片
    window.deletePhoto = function(button) {
        if (confirm('确定要删除这张照片吗？')) {
            const photoItem = button.closest('.photo-item');
            const index = Array.from(photoGrid.children).indexOf(photoItem);
            
            uploadedPhotos.splice(index, 1);
            localStorage.setItem('uploadedPhotos', JSON.stringify(uploadedPhotos));
            photoItem.remove();
        }
    };

    // 编辑照片描述
    window.editDescription = function(button) {
        const photoItem = button.closest('.photo-item');
        const index = Array.from(photoGrid.children).indexOf(photoItem);
        const newDescription = prompt('请输入新的描述：', uploadedPhotos[index].description);
        
        if (newDescription !== null) {
            uploadedPhotos[index].description = newDescription;
            localStorage.setItem('uploadedPhotos', JSON.stringify(uploadedPhotos));
            photoItem.querySelector('.photo-description').textContent = newDescription;
        }
    };

    // 初始化显示已保存的照片
    displaySavedPhotos();
}); 