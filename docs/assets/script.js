async function getThumbnail() {
  const url = document.getElementById("videoUrl").value;
  const quality = document.getElementById("quality").value;
  const videoId = extractVideoId(url);

  if (videoId) {
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;

    // ✅ Try 1080p first
    if (quality === '1080p') {
      thumbnailUrl = `https://img.youtube.com/vi/${videoId}/1920x1080.jpg`;
    }

    try {
      const response = await fetch(thumbnailUrl);
      if (!response.ok) {
        // ✅ Fallback to maxresdefault (720p)
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const liveResponse = await fetch(thumbnailUrl);
        if (!liveResponse.ok) {
          alert("No valid thumbnail found for this video.");
          return;
        }
      }

      displayThumbnail(thumbnailUrl);
    } catch (error) {
      alert("Failed to fetch thumbnail.");
      console.error("Error fetching thumbnail:", error);
    }
  } else {
    alert("Invalid YouTube URL. Please try again.");
  }
}

function displayThumbnail(thumbnailUrl) {
  const thumbnail = document.getElementById("thumbnail");
  thumbnail.src = thumbnailUrl;
  document.getElementById("thumbnailContainer").classList.remove("hidden");

  // ✅ Download button setup
  document.getElementById("downloadBtn").onclick = () => downloadThumbnail(thumbnailUrl);
}

// ✅ Generate Link and Save to Database
async function generateLink() {
  const url = document.getElementById("videoUrl").value;
  const quality = document.getElementById("quality").value;
  const videoId = extractVideoId(url);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;

  if (videoId) {
    try {
      const response = await fetch('https://ytthumbnaildownloader.onrender.com/api/thumbnails/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId, thumbnailUrl })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thumbnail saved to database!');
        document.getElementById("downloadLink").href = thumbnailUrl;
        document.getElementById("downloadLink").textContent = thumbnailUrl;
        document.getElementById("linkContainer").classList.remove("hidden");
      } else {
        alert(`Failed to save thumbnail: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving thumbnail:", error);
      alert("Failed to save thumbnail to database.");
    }
  }
}

async function downloadThumbnail(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to download thumbnail");

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "thumbnail.jpg";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    alert("Failed to download thumbnail.");
    console.error("Download error:", error);
  }
}

function extractVideoId(url) {
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// ✅ Handle login using Enter key
document.getElementById('login-form').addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent page reload
    await login(); // Call your existing login function
  }
});

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('https://ytthumbnaildownloader.onrender.com/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    alert(data.message);
    localStorage.setItem('token', data.token);
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('logout-section').classList.remove('hidden');
    fetchThumbnails(); // Load thumbnails after login
  } else {
    alert(data.message);
  }
}

function logout() {
  localStorage.removeItem('token');
  alert('Logged out');
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('logout-section').classList.add('hidden');
  document.getElementById('thumbnail-list').classList.add('hidden');
}

async function fetchThumbnails() {
  try {
    const res = await fetch('https://ytthumbnaildownloader.onrender.com/api/thumbnails');
    if (!res.ok) throw new Error(`Failed to fetch thumbnails: ${res.status}`);

    const data = await res.json();

    const list = document.getElementById('thumbnail-list');
    list.innerHTML = '';
    list.classList.remove('hidden');

    data.forEach((item) => {
      if (!item.videoId) return;

      const thumbnailUrl = `https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`;

      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>Video ID:</strong> ${item.videoId} <br>
          <strong>Thumbnail:</strong>
          <img src="${thumbnailUrl}" width="100" 
               onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg';">
        </div>
        <div class="button-group">
          <button class="view-btn" onclick="window.open('${thumbnailUrl}', '_blank')">
            <i class="fa-sharp-duotone fa-solid fa-eye"></i> View
          </button>
          <button class="download-btn" onclick="downloadThumbnail('${thumbnailUrl}')">
            <i class="fa-solid fa-download"></i> Download
          </button>
          <button class="delete-btn" onclick="deleteThumbnail('${item._id}')">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching thumbnails:', error);
    alert('Failed to load thumbnails. Please try again later.');
  }
}


async function deleteThumbnail(id) {
  if (confirm('Are you sure you want to delete this thumbnail?')) {
    const res = await fetch(`https://ytthumbnaildownloader.onrender.com/api/thumbnails/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    alert(data.message);
    fetchThumbnails(); // Refresh list after delete
  }
}

window.onload = () => {
  if (localStorage.getItem('token')) {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('logout-section').classList.remove('hidden');
    fetchThumbnails();
  }
};

