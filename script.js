const dropZone = document.getElementById('dropZone');
const fileList = document.getElementById('fileList');
const fileInput = document.getElementById('fileInput');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

dropZone.addEventListener('drop', handleDrop, false);

fileInput.addEventListener('change', function() {
    const files = this.files;
    handleFiles(files);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropZone.classList.add('highlight');
}

function unhighlight() {
    dropZone.classList.remove('highlight');
}

function handleDrop(e) {
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(event) {
            const listItem = document.createElement('div');
            listItem.classList.add('file-item');
            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-bar');
            progressBar.style.backgroundColor = getRandomColor();
            listItem.appendChild(progressBar);
            listItem.innerHTML += `<strong>${file.name}</strong> - ${((file.size / 1024) / 1024).toFixed(2)} MB`;

            fileList.appendChild(listItem);

            uploadFile(file, progressBar);
        };

        reader.readAsDataURL(file);
    }
}

function uploadFile(file, progressBar) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.open('POST', 'your_upload_endpoint_url', true);

    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            progressBar.style.width = percentComplete + '%';
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            progressBar.style.width = '100%';
        } else {
            progressBar.style.backgroundColor = 'red';
        }
    };

    xhr.send(formData);
}

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
