  // script.js
document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureButton = document.getElementById('capture');

  // Access user's camera
  navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
          video.srcObject = stream;
      })
      .catch(error => {
          console.error('Error accessing camera:', error);
      });

  // Capture the live image
  captureButton.addEventListener('click', function(event) {
      event.preventDefault();
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.style.display = 'block';
  });

  // Form submission
  const form = document.getElementById('registrationForm');
  form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Capture image data
      const capturedImage = canvas.toDataURL('image/png');

      // Collect form data
      const formData = new FormData(form);
      formData.append('liveImage', capturedImage);

      fetch('/register', {
          method: 'POST',
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          // Redirect to another page to show user info
          window.location.href = `/user/${data.id}`;
      })
      .catch(error => {
          console.error('Error:', error);
      });
  });
});
