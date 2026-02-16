# Cricket Scoreboard - Complete Match Management System

A fully functional cricket scoreboard web application built with HTML, CSS, and vanilla JavaScript. No frameworks, no backend - just pure client-side code.

## 🏏 Features

### Match Setup
- Enter Team 1 and Team 2 names
- Set number of overs per innings
- Input validation for all fields

### Toss Functionality
- Select which team calls the toss
- Choose Heads or Tails
- Random toss result generation
- Toss winner chooses to bat or bowl first

### Live Match Scoring
- **Ball-by-ball scoring system**
  - Select runs scored (0, 1, 2, 3, 4, 6)
  - Mark wickets
  - Automatic over calculation (6 balls = 1 over)
  
- **Automatic Calculations**
  - Total runs
  - Total wickets (max 10)
  - Ball count
  - Overs in format: Over.Balls (e.g., 4.3)
  - Remaining balls
  
- **Live Scoreboard Display**
  - Both teams' scores
  - Current batting team highlighted
  - Progress bar showing innings completion
  - Ball-by-ball history of current over

### Innings Management
- Automatic innings end detection:
  - 10 wickets fallen
  - Overs limit reached
- Smooth transition to second innings
- Target display in second innings

### Match Result
- Automatic winner calculation:
  - Won by runs (for batting first team)
  - Won by wickets (for chasing team)
  - Match tied
- Complete match summary

### UI/UX
- ✅ Modern, clean design
- ✅ Fully responsive (mobile + desktop)
- ✅ Smooth animations and transitions
- ✅ Color-coded balls (green for runs, red for wickets, gray for dot balls)
- ✅ Interactive buttons with hover effects
- ✅ Progress indicators

## 🚀 Deployment on Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project directory**
   ```bash
   cd cricket-scoreboard
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Login to your Vercel account
   - Link to existing project or create new one
   - Accept default settings
   - Your app will be live!

5. **For production deployment:**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard (No CLI)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**

3. **Click "Add New Project"**

4. **Import your GitHub repository**

5. **Configure project:**
   - Framework Preset: Other
   - Root Directory: `./` (default)
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

6. **Click "Deploy"**

7. **Your app will be live in seconds!**

### Method 3: Drag and Drop (Easiest)

1. **Zip the project folder**

2. **Go to [vercel.com](https://vercel.com)**

3. **Drag and drop the folder** onto the Vercel dashboard

4. **Instant deployment!**

## 📁 Project Structure

```
cricket-scoreboard/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # All JavaScript functionality
├── vercel.json     # Vercel deployment configuration
└── README.md       # This file
```

## 🎮 How to Use

### 1. Match Setup
- Enter both team names
- Set the number of overs (e.g., 5, 10, 20)
- Click "Start Match"

### 2. Toss
- Select which team will call the toss
- Choose Heads or Tails
- See the random result
- Winner chooses to Bat or Bowl

### 3. First Innings
- Select runs scored on each ball (0-6)
- Check "Wicket Fallen" if a wicket fell
- Click "Record Ball"
- Watch the live scoreboard update
- Innings ends when:
  - 10 wickets fall, OR
  - All overs are completed
- Click "End Innings" to proceed

### 4. Second Innings
- Target is displayed
- Same scoring process
- Match ends when:
  - Target is achieved
  - 10 wickets fall, OR
  - All overs are completed

### 5. Match Result
- Winner is automatically calculated
- See complete match summary
- Click "Start New Match" to play again

## 💻 Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd cricket-scoreboard
   ```

2. **Open in browser**
   - Simply open `index.html` in any modern web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

3. **No build process needed!** Pure HTML, CSS, and JavaScript.

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid, Flexbox, animations
- **Vanilla JavaScript** - Pure ES6+ JavaScript, no frameworks

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Key Features
- No external dependencies
- No build process required
- Fully client-side (no server needed)
- Works offline after first load
- Responsive design with mobile-first approach

## 🎨 Customization

### Changing Colors
Edit `styles.css`:
- Primary color: `#1e3c72` and `#2a5298`
- Success color: `#28a745`
- Warning color: `#ffc107`
- Danger color: `#dc3545`

### Modifying Layout
- All styles are in `styles.css`
- Organized by sections with clear comments
- Responsive breakpoint at 768px

### Adding Features
- All logic is in `script.js`
- Well-commented and organized
- Easy to extend with new functionality

## 📝 Code Structure

### JavaScript Organization
1. **Game State Object** - Stores all match data
2. **DOM Elements** - References to HTML elements
3. **Utility Functions** - Helper functions
4. **Screen 1: Setup** - Match setup handlers
5. **Screen 2: Toss** - Toss functionality
6. **Screen 3: Live Match** - Scoring logic
7. **Screen 4: Result** - Match result calculation

### CSS Organization
1. **Global Styles**
2. **Header**
3. **Screens**
4. **Forms**
5. **Buttons**
6. **Toss Section**
7. **Scoreboard**
8. **Ball Controls**
9. **Results**
10. **Responsive Design**

## 🐛 Troubleshooting

### Issue: Vercel deployment not working
**Solution:** Make sure `vercel.json` is in the root directory

### Issue: Styles not loading
**Solution:** Check that `styles.css` and `script.js` are in the same directory as `index.html`

### Issue: App not responsive on mobile
**Solution:** Ensure viewport meta tag is present in HTML (already included)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ for cricket lovers everywhere!** 🏏
