### NASA Explorer (Cyberpunk Edition)

A modern, cyberpunk-themed web application that lets users explore NASA data, view space imagery, track real-time natural events, and save their favorite discoveries — all in a visually immersive experience.

### Overview

NASA Explorer is a full-stack web application built using Flask, JavaScript, and Supabase. It integrates multiple NASA APIs to provide real-time and historical space data, wrapped in a futuristic cyberpunk UI featuring neon effects, glassmorphism, and dynamic video backgrounds.

The goal of this project is to combine space exploration + modern UI/UX + authentication + database storage into one seamless experience.

### Features
 Authentication (Supabase)
User Sign Up / Login
Secure session handling
Persistent login state
## Astronomy Picture of the Day (APOD)
Fetches daily space image or video from NASA
Displays title + full explanation
Save favorite APODs
## NASA Image Library
Browse space images from NASA archives
Clean card-based UI
Save any image to favorites
## EONET Events (Real-time)
Displays natural events (wildfires, storms, etc.)
Categorized event types
Real-time data from NASA EONET API
## Favorites System
Save APOD, images, or events
Stored in Supabase database
Personalized per user
## Dynamic Video Background
Background video changes based on section:
APOD → default space video
Images → galaxy visuals
Events → earth / disaster visuals
Favorites → calm futuristic theme
## Cyberpunk UI
Neon glow effects (blue + pink)
Glassmorphism cards
Animated background + scanline effect
Responsive design
## Tech Stack
Backend
  Python (Flask)
  REST APIs (NASA APIs)
Frontend
  HTML5
  CSS3 (Cyberpunk theme)
  JavaScript (Vanilla)
Database & Auth
  Supabase (PostgreSQL + Auth)
APIs Used 
 NASA APOD API
 NASA Image & Video Library API
 NASA EONET (Earth Observatory Natural Event Tracker)
📁 Project Structure
project/
│
├── app.py
├── .env
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   ├── script.js
│   │
│   ├── images/
│   │   ├── logo.png
│   │   └── login-page-bg-img.png
│   │
│   └── videos/
│       ├── default.mp4
│       ├── images.mp4
│       ├── events.mp4
│       └── favorites.mp4
⚙️ Setup Instructions
1. Clone Repository
git clone https://github.com/yourusername/nasa-explorer.git
cd nasa-explorer
2. Install Dependencies
pip install flask python-dotenv requests
3. Configure Environment Variables

Create a .env file:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
NASA_API_KEY=your_nasa_api_key
4. Run Application
python app.py

Open in browser:

http://127.0.0.1:5001
### How It Works
User logs in via Supabase Auth
Flask serves frontend and API endpoints
JavaScript fetches data from Flask routes
Flask fetches data from NASA APIs
UI dynamically updates content + background
Favorites are stored in Supabase database

### Future Improvements
. Remove from favorites
. Search functionality (Mars, Moon, etc.)
. Smooth video transitions
. Mobile UI optimization
. Deployment (Render / Vercel / Railway)
. Inspiration

This project is inspired by:

NASA open data initiatives
Cyberpunk / futuristic UI design
Real-time data visualization

### Author

Developed by DRDOOM,Mohit Bhawnani

## License

This project is for educational purposes. NASA APIs are publicly available.

## Acknowledgements
  NASA Open APIs
  Supabase
  Flask Community
### Final Note

NASA Explorer is more than just a data viewer — it’s an experience.
Blending science, design, and technology, this project demonstrates how raw data can be transformed into something immersive and visually powerful.

“Exploring space shouldn’t feel boring — it should feel futuristic.”
