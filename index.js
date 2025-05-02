document.addEventListener('DOMContentLoaded', () => {
    const openCameraButton = document.getElementById('openCamera');
    const openGalleryButton = document.getElementById('openGallery');
    const cameraModeSelect = document.getElementById('cameraMode'); // Dropdown to select camera mode

    // Camera functionality
    openCameraButton.addEventListener('click', () => {
        // Get the selected camera mode (front or back)
        const selectedCameraMode = cameraModeSelect.value;

        // Create a video element to display the camera feed
        const videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.style.width = '100%';
        videoElement.style.height = 'auto';

        // Create a modal-like container for the camera feed
        const cameraModal = document.createElement('div');
        cameraModal.style.position = 'fixed';
        cameraModal.style.top = '0';
        cameraModal.style.left = '0';
        cameraModal.style.width = '100%';
        cameraModal.style.height = '100%';
        cameraModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        cameraModal.style.display = 'flex';
        cameraModal.style.justifyContent = 'center';
        cameraModal.style.alignItems = 'center';
        cameraModal.appendChild(videoElement);

        // Create a button to capture the image
        const captureButton = document.createElement('button');
        captureButton.textContent = 'Capture';
        captureButton.style.position = 'absolute';
        captureButton.style.bottom = '20px';
        captureButton.style.padding = '10px 20px';
        captureButton.style.backgroundColor = '#3498db';
        captureButton.style.color = 'white';
        captureButton.style.border = 'none';
        captureButton.style.borderRadius = '5px';
        captureButton.style.cursor = 'pointer';
        cameraModal.appendChild(captureButton);

        // Create a button to close the camera modal
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '20px';
        closeButton.style.right = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#e74c3c';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        cameraModal.appendChild(closeButton);

        // Append the modal to the body
        document.body.appendChild(cameraModal);

        // Close the camera modal
        closeButton.addEventListener('click', () => {
            videoElement.srcObject.getTracks().forEach((track) => track.stop());
            document.body.removeChild(cameraModal);
        });

        // Access the camera using the MediaDevices API
        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: selectedCameraMode } }) // Use the selected camera mode
            .then((stream) => {
                videoElement.srcObject = stream;

                // Capture the image when the capture button is clicked
                captureButton.addEventListener('click', () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;
                    const context = canvas.getContext('2d');
                    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                    // Stop the camera stream
                    videoElement.srcObject.getTracks().forEach((track) => track.stop());
                    document.body.removeChild(cameraModal);

                    // Display the captured image
                    const capturedImage = canvas.toDataURL('image/png');
                    const imgElement = document.createElement('img');
                    imgElement.src = capturedImage;
                    imgElement.style.width = '100%';
                    imgElement.style.marginTop = '20px';
                    document.querySelector('.container').appendChild(imgElement);
                });
            })
            .catch((error) => {
                console.error('Error accessing the camera:', error);
                alert('Unable to access the camera. Please ensure permissions are granted and the camera is available.');
                document.body.removeChild(cameraModal);
            });
    });

    // Gallery functionality
    openGalleryButton.addEventListener('click', () => {
        // Create a hidden file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*'; // Restrict to image files
        fileInput.style.display = 'none';

        // Append the file input to the body
        document.body.appendChild(fileInput);

        // Trigger the file input click event
        fileInput.click();

        // Handle the file selection
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgElement = document.createElement('img');
                    imgElement.src = e.target.result;
                    imgElement.style.width = '100%';
                    imgElement.style.marginTop = '20px';
                    document.querySelector('.container').appendChild(imgElement);
                };
                reader.readAsDataURL(file);
            }

            // Remove the file input element after use to keep the DOM clean
            document.body.removeChild(fileInput);
        });
    });
});