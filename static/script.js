// ================= BACKGROUND VIDEO =================

// 🎥 Change background video
function changeBackground(videoName) {
  const video = document.getElementById("bg-video");
  if (!video) return;

  video.src = `/static/videos/${videoName}`;
  video.load();
}


// ================= UI CONTROL =================

function showApp() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("app-section").style.display = "block";
}

function showAuth() {
  document.getElementById("auth-section").style.display = "flex";
  document.getElementById("app-section").style.display = "none";
}


// ================= AUTH =================

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    showApp();
  }
}

async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  alert(error ? error.message : "Signup successful! Now login.");
}

async function logout() {
  await supabase.auth.signOut();
  showAuth();
}


// ================= ON LOAD =================

window.onload = async () => {
  changeBackground("default.mp4"); // default video

  const { data } = await supabase.auth.getUser();

  if (data.user) {
    showApp();
  } else {
    showAuth();
  }
};


// ================= NASA API =================

// 🌌 APOD
async function loadAPOD() {
  changeBackground("default.mp4");

  try {
    const res = await fetch("/apod");
    const data = await res.json();

    document.getElementById("root").innerHTML = `
      <div class="card">
        <img src="${data.url}" />
        <h3>${data.title}</h3>
        <p>${data.explanation ? data.explanation.slice(0, 100) : ""}</p>
        <button onclick="saveFavorite('${data.title}', '${data.url}')">⭐ Save</button>
      </div>
    `;
  } catch {
    alert("Error loading APOD");
  }
}


// 🛰️ NASA Images
async function loadImages() {
  changeBackground("images.mp4");

  try {
    const res = await fetch("/images");
    const data = await res.json();

    let html = "";

    const items = data.collection.items;

    items.slice(0, 8).forEach(item => {
      const img = item.links && item.links.length > 0 ? item.links[0].href : "";
      const title = item.data[0].title;

      html += `
        <div class="card">
          <img src="${img}" />
          <p>${title}</p>
        </div>
      `;
    });

    document.getElementById("root").innerHTML = html;

  } catch {
    alert("Error loading images");
  }
}


// 🌍 EONET Events
async function loadEvents() {
  changeBackground("events.mp4");

  try {
    document.getElementById("root").innerHTML = "Loading events...";

    const res = await fetch("/events");
    const data = await res.json();

    let html = "";

    data.events.slice(0, 8).forEach(event => {
      const title = event.title;
      const category = event.categories[0]?.title || "Unknown";
      const date = event.geometry[0]?.date || "";

      html += `
        <div class="card">
          <h3>${title}</h3>
          <p>Type: ${category}</p>
          <p>Date: ${date}</p>
        </div>
      `;
    });

    document.getElementById("root").innerHTML = html;

  } catch {
    document.getElementById("root").innerHTML = "Error loading events";
  }
}


// ================= FAVORITES =================

// Save favorite
async function saveFavorite(title, image) {
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    alert("Login first");
    return;
  }

  const { error } = await supabase.from("favorites").insert([
    {
      user_id: user.id,
      title: title,
      image_url: image,
    },
  ]);

  alert(error ? error.message : "Saved!");
}


// Load favorites
async function loadFavorites() {
  changeBackground("favorites.mp4");

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  console.log("User:", user);

  if (!user) {
    alert("Login first");
    return;
  }

  const { data: favs, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id);

  console.log("Favorites:", favs, error);

  if (error) {
    alert(error.message);
    return;
  }

  if (!favs || favs.length === 0) {
    document.getElementById("root").innerHTML = "No favorites yet";
    return;
  }

  let html = "";

  favs.forEach(item => {
    html += `
      <div class="card">
        <img src="${item.image_url}" />
        <p>${item.title}</p>
      </div>
    `;
  });

  document.getElementById("root").innerHTML = html;
}