// ================= UI CONTROL =================

function showApp() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("app-section").style.display = "block";
  document.body.classList.add("app-active");
}

function showAuth() {
  document.getElementById("auth-section").style.display = "flex";
  document.getElementById("app-section").style.display = "none";
  document.body.classList.remove("app-active");
}


// ================= AUTH =================

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) alert(error.message);
  else showApp();
}

async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  alert(error ? error.message : "Signup successful!");
}

async function logout() {
  await supabase.auth.signOut();
  showAuth();
}

window.onload = async () => {
  const { data } = await supabase.auth.getUser();
  data.user ? showApp() : showAuth();
};


// ================= VIDEO CHANGE =================

function changeBackground(video) {
  const videoEl = document.getElementById("bg-video");
  videoEl.src = `/static/videos/${video}`;
  videoEl.load();
}


// ================= APOD =================

async function loadAPOD() {
  changeBackground("default.mp4");

  const res = await fetch("/apod");
  const data = await res.json();

  document.getElementById("root").innerHTML = `
    <div class="card">
      <img src="static/images/reze.png" 
      style="
          width: 250px !important;
          height: 250px !important;
          object-fit: cover;

          border-radius: 50%;

          border: 2px solid #00f0ff;

          box-shadow:
            0 0 10px #00f0ff,
            0 0 30px #ff2bd6;
"/>
      <h3>${data.title}</h3>
      <p>${data.explanation}</p>
      <button id="saveBtn">⭐ Save</button>
    </div>
  `;
  document.getElementById("saveBtn").onclick = () => {
    const media = data.media_type === "image" ? data.url : "";
    saveFavorite(data.title, media);
  };
}


// ================= NASA IMAGES =================

async function loadImages() {
  changeBackground("images.mp4");

  try {
    const res = await fetch("/images");
    const data = await res.json();

    let html = "";

    const items = data.collection.items.filter(item => item.links);

    items.slice(0, 8).forEach(item => {
      const img = item.links[0].href;
      const title = item.data[0].title;

      html += `
        <div class="card">
          <img src="${img}" />
          <p>${title}</p>
          <button onclick="saveFavorite('${title}', '${img}')">⭐ Save</button>
        </div>
      `;
    });

    document.getElementById("root").innerHTML = html;

  } catch (err) {
    document.getElementById("root").innerHTML = "Error loading images";
  }
}


// ================= EVENTS =================

async function loadEvents() {
  changeBackground("events.mp4");

  try {
    const res = await fetch("/events");
    const data = await res.json();

    let html = "";

    data.events.slice(0, 8).forEach(event => {
      const title = event.title || "No title";
      const category = event.categories?.[0]?.title || "Unknown";
      const date = event.geometry?.[0]?.date
        ? event.geometry[0].date.split("T")[0]
        : "No date";

      html += `
        <div class="card">
          <h3>${title}</h3>
          <p>Type: ${category}</p>
          <p>Date: ${date}</p>
          <button onclick="saveFavorite('${title}', '')">⭐ Save</button>
        </div>
      `;
    });

    document.getElementById("root").innerHTML = html;

  } catch (err) {
    document.getElementById("root").innerHTML = "Error loading events";
  }
}


// ================= FAVORITES =================

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

async function loadFavorites() {
  changeBackground("favorites.mp4");

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    alert("Login first");
    return;
  }

  const { data: favs, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id);

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
