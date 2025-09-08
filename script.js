// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9vLpSbaLXKda-NX3PkmHUQynmA-EgkU4",
    authDomain: "toon-belly.firebaseapp.com",
    databaseURL: "https://toon-belly-default-rtdb.firebaseio.com",
    projectId: "toon-belly",
    storageBucket: "toon-belly.firebasestorage.app",
    messagingSenderId: "796622220428",
    appId: "1:796622220428:web:6f2b4a4fe413d305241fa9",
    measurementId: "G-4W7KS1G39Y"
};

// Check if Firebase is loaded
if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded! Check CDN links.');
    document.getElementById('connectionStatus').innerHTML = '<i class="fas fa-circle text-danger"></i> Firebase Error';
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let categories = {};
let videos = {};
let currentEditingCategory = null;
let currentEditingVideo = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadVideos();
    updateDashboard();
});

// Navigation
function showSection(sectionName, element) {
    // Prevent default link behavior
    event.preventDefault();
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionName).style.display = 'block';
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
}

// Load Categories
function loadCategories() {
    database.ref('categories').on('value', (snapshot) => {
        categories = snapshot.val() || {};
        displayCategories();
        updateCategoryDropdown();
        updateDashboard();
    });
}

// Load Videos
function loadVideos() {
    database.ref('videos').on('value', (snapshot) => {
        videos = snapshot.val() || {};
        displayVideos();
        updateDashboard();
    });
}

// Display Categories
function displayCategories() {
    const tbody = document.getElementById('categoriesTable');
    tbody.innerHTML = '';
    
    Object.keys(categories).forEach(categoryId => {
        const category = categories[categoryId];
        const row = `
            <tr>
                <td>${category.name}</td>
                <td>${category.id}</td>
                <td>
                    <span class="status-badge ${category.isActive ? 'status-active' : 'status-inactive'}">
                        ${category.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editCategory('${categoryId}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory('${categoryId}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-${category.isActive ? 'warning' : 'success'}" 
                            onclick="toggleCategoryStatus('${categoryId}')">
                        <i class="fas fa-${category.isActive ? 'eye-slash' : 'eye'}"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Display Videos
function displayVideos() {
    const tbody = document.getElementById('videosTable');
    tbody.innerHTML = '';
    
    Object.keys(videos).forEach(categoryId => {
        const categoryVideos = videos[categoryId] || {};
        Object.keys(categoryVideos).forEach(videoId => {
            const video = categoryVideos[videoId];
            const row = `
                <tr>
                    <td>${video.title}</td>
                    <td>${video.category}</td>
                    <td>${video.views.toLocaleString()}</td>
                    <td>
                        <span class="status-badge ${video.isActive ? 'status-active' : 'status-inactive'}">
                            ${video.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-2" onclick="editVideo('${categoryId}', '${videoId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteVideo('${categoryId}', '${videoId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-${video.isActive ? 'warning' : 'success'}" 
                                onclick="toggleVideoStatus('${categoryId}', '${videoId}')">
                            <i class="fas fa-${video.isActive ? 'eye-slash' : 'eye'}"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    });
}

// Update Dashboard
function updateDashboard() {
    const totalCats = Object.keys(categories).length;
    const activeCats = Object.values(categories).filter(cat => cat.isActive).length;
    
    let totalVids = 0;
    let activeVids = 0;
    
    Object.values(videos).forEach(categoryVideos => {
        Object.values(categoryVideos).forEach(video => {
            totalVids++;
            if (video.isActive) activeVids++;
        });
    });
    
    document.getElementById('totalCategories').textContent = totalCats;
    document.getElementById('totalVideos').textContent = totalVids;
}

// Update Category Dropdown
function updateCategoryDropdown() {
    const select = document.getElementById('videoCategory');
    select.innerHTML = '<option value="">Select Category</option>';
    
    Object.values(categories).forEach(category => {
        if (category.isActive) {
            select.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        }
    });
}

// Show Add Category Modal
function showAddCategoryModal() {
    currentEditingCategory = null;
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').disabled = false; // Enable ID field for new category
    document.querySelector('#addCategoryModal .modal-title').textContent = 'Add Category';
    new bootstrap.Modal(document.getElementById('addCategoryModal')).show();
}

// Show Add Video Modal
function showAddVideoModal() {
    currentEditingVideo = null;
    document.getElementById('videoForm').reset();
    document.querySelector('#addVideoModal .modal-title').textContent = 'Add Video';
    new bootstrap.Modal(document.getElementById('addVideoModal')).show();
}

// Save Category
function saveCategory() {
    const id = document.getElementById('categoryId').value.trim();
    const name = document.getElementById('categoryName').value.trim();
    const imageUrl = document.getElementById('categoryImage').value.trim();
    const isActive = document.getElementById('categoryActive').checked;
    
    if (!id || !name || !imageUrl) {
        alert('Please fill all required fields');
        return;
    }
    
    const categoryData = {
        id: id,
        name: name,
        imageUrl: imageUrl,
        folderPath: `categories/${id}`,
        isActive: isActive
    };
    
    // Check if editing or adding new
    const ref = database.ref(`categories/${currentEditingCategory || id}`);
    ref.set(categoryData)
        .then(() => {
            bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
            alert(currentEditingCategory ? 'Category updated successfully!' : 'Category saved successfully!');
            currentEditingCategory = null;
        })
        .catch(error => {
            alert('Error saving category: ' + error.message);
        });
}

// Save Video
function saveVideo() {
    const title = document.getElementById('videoTitle').value.trim();
    const youtubeLink = document.getElementById('youtubeLink').value.trim();
    const categoryId = document.getElementById('videoCategory').value;
    const description = document.getElementById('videoDescription').value.trim();
    const views = parseInt(document.getElementById('videoViews').value) || 0;
    const isActive = document.getElementById('videoActive').checked;
    
    if (!title || !youtubeLink || !categoryId) {
        alert('Please fill all required fields');
        return;
    }
    
    const category = categories[categoryId];
    const videoId = currentEditingVideo ? currentEditingVideo.videoId : 'video_' + Date.now();
    
    const videoData = {
        id: currentEditingVideo ? videos[currentEditingVideo.categoryId][currentEditingVideo.videoId].id : Date.now(),
        title: title,
        youtubeLink: youtubeLink,
        thumbnailUrl: `https://i.ytimg.com/vi/${youtubeLink}/hqdefault.jpg`,
        description: description,
        category: category.name,
        categoryId: categoryId,
        views: views,
        uploadDate: new Date().toISOString().split('T')[0],
        isActive: isActive,
        timestamp: Date.now()
    };
    
    // If editing and category has changed, remove from old category
    if (currentEditingVideo && currentEditingVideo.categoryId !== categoryId) {
        database.ref(`videos/${currentEditingVideo.categoryId}/${currentEditingVideo.videoId}`).remove();
    }
    
    database.ref(`videos/${categoryId}/${videoId}`).set(videoData)
        .then(() => {
            bootstrap.Modal.getInstance(document.getElementById('addVideoModal')).hide();
            alert(currentEditingVideo ? 'Video updated successfully!' : 'Video saved successfully!');
            currentEditingVideo = null;
        })
        .catch(error => {
            alert('Error saving video: ' + error.message);
        });
}

// Edit Category
function editCategory(categoryId) {
    const category = categories[categoryId];
    currentEditingCategory = categoryId;
    
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryId').disabled = true; // Disable ID field when editing
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryImage').value = category.imageUrl;
    document.getElementById('categoryActive').checked = category.isActive;
    
    document.querySelector('#addCategoryModal .modal-title').textContent = 'Edit Category';
    new bootstrap.Modal(document.getElementById('addCategoryModal')).show();
}

// Edit Video
function editVideo(categoryId, videoId) {
    const video = videos[categoryId][videoId];
    currentEditingVideo = { categoryId, videoId };
    
    document.getElementById('videoTitle').value = video.title;
    document.getElementById('youtubeLink').value = video.youtubeLink;
    document.getElementById('videoCategory').value = video.categoryId;
    document.getElementById('videoDescription').value = video.description;
    document.getElementById('videoViews').value = video.views;
    document.getElementById('videoActive').checked = video.isActive;
    
    document.querySelector('#addVideoModal .modal-title').textContent = 'Edit Video';
    new bootstrap.Modal(document.getElementById('addVideoModal')).show();
}

// Delete Category
function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
        database.ref(`categories/${categoryId}`).remove()
            .then(() => {
                alert('Category deleted successfully!');
            })
            .catch(error => {
                alert('Error deleting category: ' + error.message);
            });
    }
}

// Delete Video
function deleteVideo(categoryId, videoId) {
    if (confirm('Are you sure you want to delete this video?')) {
        database.ref(`videos/${categoryId}/${videoId}`).remove()
            .then(() => {
                alert('Video deleted successfully!');
            })
            .catch(error => {
                alert('Error deleting video: ' + error.message);
            });
    }
}

// Toggle Category Status
function toggleCategoryStatus(categoryId) {
    const category = categories[categoryId];
    database.ref(`categories/${categoryId}/isActive`).set(!category.isActive);
}

// Toggle Video Status
function toggleVideoStatus(categoryId, videoId) {
    const video = videos[categoryId][videoId];
    database.ref(`videos/${categoryId}/${videoId}/isActive`).set(!video.isActive);
}
