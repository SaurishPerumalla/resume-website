# Saurish Perumalla - Resume Website

A modern, responsive, high-performance personal resume and portfolio website built directly from your resume.

🔗 **Live Website**: [https://saurishperumalla.github.io/resume-website/](https://saurishperumalla.github.io/resume-website/)

## 🌟 Key Features

- **Accurate Information & Structure**: Faithfully incorporates all content from your resume:
  - **Summary**: Highlighted profile overview and 4 core value proposition cards.
  - **Work Experience**: SEO Internship at Bullion Fortune (Edison, NJ) with responsibilities, impact tags, and timeline.
  - **Core Skills**: Data analysis, problem solving, adaptability, multitasking, and self-motivation with interactive visual indicators.
  - **Education & Extracurriculars**: Rocky Hill High School, 4-Year Honor Roll, Math Team, Science Team, Model UN, Chess Club, and JV Tennis.
  - **Languages**: Segmented proficiency meters replicating your resume's visual style for Telugu (Native 5/5) and French (Professional 3/5).
- **Interactive Capabilities**:
  - **One-Click Copy**: Quick copy buttons for email (`saurish.perumalla@gmail.com`) and phone (`860-897-6982`) with toast notifications.
  - **Interactive Contact Form**: Client-side validation and automated mailto connection.
  - **Dark & Light Mode**: Smooth theme toggle with preference persistence in `localStorage`.
  - **Original Resume Modal**: Interactive preview of the exact layout of your original resume.
  - **Print / PDF Ready**: Dedicated `@media print` styles so pressing **"Print / PDF"** formats a clean ATS-friendly document with the signature royal blue header!

---

## 🚀 How to Run Locally

### Option 1: Direct File Open
Simply double-click `index.html` or open it in any web browser (Chrome, Safari, Edge, Firefox).

### Option 2: Local HTTP Server (Recommended)
In your terminal, navigate to this folder and run:
```bash
python3 -m http.server 8000
```
Then visit [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🌐 Deploy to GitHub Pages (Automated via GitHub Actions)

The repository includes a ready-to-use GitHub Action (`.github/workflows/deploy.yml`) that automatically deploys your website whenever you push changes to `main`.

### Setup Steps:
1. **Initialize Git & Push to GitHub**:
   ```bash
   cd /Users/saurishperumalla/.gemini/antigravity/scratch/resume-website
   git init
   git add .
   git commit -m "Initial commit of resume website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Actions for Pages**:
   - In your GitHub repository, click **Settings**.
   - In the left sidebar, click **Pages** (under *Code and automation*).
   - Under **Build and deployment > Source**, select **"GitHub Actions"**.

3. **Automatic Deployment**:
   - As soon as you select "GitHub Actions" (or push a new commit to `main`), the workflow will run automatically.
   - You can monitor the deployment under the **Actions** tab.
   - Your site will be published live at `https://<your-username>.github.io/<your-repo-name>/`!

---

## 📁 Project Structure
```
resume-website/
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions workflow for automated Pages deployment
├── .gitignore           # Git ignore list
├── index.html           # Semantic HTML5 layout and modal structure
├── styles.css           # Custom styling, themes, animations, and print stylesheet
├── script.js            # Theme toggle, clipboard helpers, form actions & animations
└── README.md            # Documentation and deployment guide
```

