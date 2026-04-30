// ================= UI CONTROL =================

// Show NASA app
function showApp() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("app-section").style.display = "block";
}

// Show login page
function showAuth() {
  document.getElementById("auth-section").style.display = "flex";
  document.getElementById("app-section").style.display = "none";
}

// ================= AUTH =================

// Login
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

// Signup
async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  alert(error ? error.message : "Signup successful! Now login.");
}

// Logout
async function logout() {
  await supabase.auth.signOut();
  showAuth();
}

//  Always show login first
window.onload = async () => {
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    showApp();
  } else {
    showAuth();
  }
};

// ================= NASA API =================

//  APOD
async function loadAPOD() {
  try {
    const res = await fetch("/apod");
    const data = await res.json();

    document.getElementById("root").innerHTML = `
      <div class="card">
        <img src="${data.url}" />
        <h3>${data.title}</h3>
        <p>${data.explanation.slice(0, 100)}...</p>
        <button onclick="saveFavorite('${data.title}', '${data.url}')">⭐ Save</button>
      </div>
    `;
  } catch (err) {
    alert("Error loading APOD");
  }
}

// Mars Photos
async function loadMars() {
  try {
    const res = await fetch("/mars");
    const data = await res.json();

    let html = "";

    data.photos.slice(0, 8).forEach(photo => {
      html += `
        <div class="card">
          <img src="${photo.img_src}" />
          <p>${photo.rover.name}</p>
        </div>
      `;
    });

    document.getElementById("root").innerHTML = html;
  } catch (err) {
    alert("Error loading Mars photos");
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
    alert("Error loading favorites");
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