// 将所有全局函数定义在最外层
window.changeImage = function(button) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgElement = button.closest('.gallery-item').querySelector('img');
                const oldSrc = imgElement.src;
                imgElement.src = e.target.result;
                
                // 保存更改到 localStorage
                const savedImages = JSON.parse(localStorage.getItem('savedImages') || '{}');
                savedImages[oldSrc] = e.target.result;
                localStorage.setItem('savedImages', JSON.stringify(savedImages));
                
                // 添加动画效果
                imgElement.style.animation = 'fadeIn 0.5s';
            };
            reader.readAsDataURL(file);
        }
    };

    fileInput.click();
};

window.sendMessage = function() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, 'user-message');
    input.value = '';
    setTimeout(() => {
        const responses = [
            "我在听呢~",
            "真是甜蜜的故事呢！",
            "要一直幸福下去哦！",
            "感觉你们很般配呢！",
            "真是太浪漫了！"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'ai-message');
    }, 1000);
};

window.closeAssistant = function() {
    document.getElementById('aiAssistant').style.display = 'none';
};

// 页面加载完成后执行的代码
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已登录
    if (!sessionStorage.getItem('isLoggedIn')) {
        // 如果未登录，重定向到登录页面
        window.location.href = 'login.html';
        return;
    }
    
    // 轮播功能
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // 导航功能
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');

    function showSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
        
        const targetSection = document.querySelector(sectionId);
        const targetLink = document.querySelector(`nav a[href="${sectionId}"]`);
        
        if (targetSection) targetSection.classList.add('active');
        if (targetLink) targetLink.classList.add('active');
    }

    // 事件监听
    prevButton.addEventListener('click', () => {
        prevSlide();
        stopSlideShow();
        startSlideShow();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        stopSlideShow();
        startSlideShow();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            stopSlideShow();
            startSlideShow();
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href');
            showSection(sectionId);
            history.pushState(null, '', sectionId);
        });
    });

    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', stopSlideShow);
    carousel.addEventListener('mouseleave', startSlideShow);

    // 处理浏览器前进后退
    window.addEventListener('popstate', () => {
        const sectionId = window.location.hash || '#home';
        showSection(sectionId);
    });

    // 初始化
    const initialSection = window.location.hash || '#home';
    showSection(initialSection);
    startSlideShow();

    const video = document.querySelector('video');
    let autoSlideInterval;
    let isVideoPlaying = false;

    // 监听视频播放状态
    video.addEventListener('play', function() {
        isVideoPlaying = true;
        // 暂停自动轮播
        clearInterval(autoSlideInterval);
    });

    video.addEventListener('pause', function() {
        isVideoPlaying = false;
        // 恢复自动轮播
        startAutoSlide();
    });

    video.addEventListener('ended', function() {
        isVideoPlaying = false;
        // 视频结束后恢复自动轮播
        startAutoSlide();
    });

    // 修改轮播逻辑
    function startAutoSlide() {
        if (!isVideoPlaying) {
            autoSlideInterval = setInterval(() => {
                // 原有的轮播逻辑
                const nextButton = document.querySelector('.carousel-button.next');
                nextButton.click();
            }, 5000); // 5秒切换一次
        }
    }

    // 初始启动自动轮播
    startAutoSlide();

    // 添加照片墙功能
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
            <button class="delete-button" onclick="deletePhoto(this)">×</button>
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
                const photoData = {
                    url: event.target.result,
                    date: new Date().toLocaleDateString()
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
        const photoItem = button.closest('.photo-item');
        const index = Array.from(photoGrid.children).indexOf(photoItem);
        
        uploadedPhotos.splice(index, 1);
        localStorage.setItem('uploadedPhotos', JSON.stringify(uploadedPhotos));
        photoItem.remove();
    };

    // 初始化显示已保存的照片
    displaySavedPhotos();

    // 恢复保存的图片
    const savedImages = JSON.parse(localStorage.getItem('savedImages') || '{}');
    const images = document.querySelectorAll('.gallery-item img');
    
    images.forEach(img => {
        if (savedImages[img.src]) {
            img.src = savedImages[img.src];
        }
    });

    // 添加事件监听器
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        aiInput.addEventListener('focus', function() {
            document.getElementById('aiAssistant').style.display = 'block';
        });
    }

    // 添加编辑标题功能
    window.editTitle = function(element) {
        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.value = element.textContent;
        input.className = 'edit-title';
        
        // 替换原有文本
        const originalText = element.textContent;
        element.textContent = '';
        element.appendChild(input);
        input.focus();
        
        // 处理失去焦点事件
        input.onblur = function() {
            if (this.value.trim() === '') {
                element.textContent = originalText;
            } else {
                element.textContent = this.value;
            }
        };
        
        // 处理回车键
        input.onkeydown = function(e) {
            if (e.key === 'Enter') {
                if (this.value.trim() === '') {
                    element.textContent = originalText;
                } else {
                    element.textContent = this.value;
                }
                input.blur();
            }
        };
    };

    // 在页面加载完成后添加事件监听器
    const editableTexts = document.querySelectorAll('.editable');
    editableTexts.forEach(text => {
        text.onclick = function() {
            editTitle(this);
        };
    });

    // 爱心特效
    const container = document.getElementById('loveAnimation');
    
    // 创建爱心
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        
        // 随机位置
        heart.style.left = Math.random() * 100 + 'vw';
        // 随机大小
        const size = Math.random() * 20 + 10;
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';
        // 随机动画时长
        heart.style.animationDuration = Math.random() * 2 + 3 + 's';
        
        container.appendChild(heart);
        
        // 动画结束后移除爱心
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }
    
    // 初始创建一些爱心
    for(let i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 300);
    }
    
    // 每隔一段时间创建新的爱心
    setInterval(() => {
        if(container.children.length < 20) {
            createHeart();
        }
    }, 800);
});

// 辅助函数
function addMessage(text, className) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
} 