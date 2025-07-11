
# 🎯 YT Thumbnail Ranker

An intelligent web app that helps YouTubers **automatically rate and compare thumbnails** to determine which one is likely to get the highest **click-through rate (CTR)**. Say goodbye to guesswork—hello data-driven decisions!

---

## 📸 Preview

![yt1](https://github.com/user-attachments/assets/9927da92-fcd4-445b-a8b1-e4ed4e3c5f2b)

![yt2](https://github.com/user-attachments/assets/41181265-c606-44d8-9203-5686e81f0834)

> *A simple, intuitive UI where creators can input their video URL or thumbnails and get ranked results.*

---

## 🧠 Problem Statement

Choosing the perfect thumbnail is a make-or-break deal on YouTube. With thousands of videos uploaded every minute, even great content can get buried if the thumbnail doesn’t stand out. Creators often struggle to decide which thumbnail to use, leading to suboptimal engagement.

---

## 🎯 Aim

To develop an algorithm that **rates and compares YouTube thumbnails**, helping content creators select the one with the best potential for click-throughs.

---

## 🚀 Features

- 📤 Upload or provide a YouTube URL to extract thumbnails.
- ⚖️ Compare multiple thumbnails side by side.
- 🧠 Automated thumbnail ranking based on visual cues and metadata.
- 📊 Stores analysis results for future reference.
- 🧩 Easy-to-use, fast interface built with AngularJS.

---

## 🧰 Tech Stack

| Layer        | Tools Used                        |
|-------------|------------------------------------|
| Frontend     | HTML, CSS, AngularJS              |
| Backend      | Node.js, Express.js               |
| Database     | MongoDB                           |
| APIs         | YouTube Data API, youtube-dl-exec |
| UI Icons     | Font Awesome                      |

---

## 🧩 System Architecture

![yt-flow](https://github.com/user-attachments/assets/ec5eda07-f375-4e96-a198-595741674ccd)

> *High-level architecture showing user input, API interaction, comparison logic, and output interface.*

---

## 🗂️ Project Modules

### 🎨 Frontend
- **User Interface**: Input forms for URLs and image uploads
- **Display Module**: Shows thumbnails and their data
- **Controllers**:  
  - `MainController` – manages input handling  
  - `MatchController` – manages comparisons

### ⚙️ Backend
- **Server**: Express.js handles API requests and serves UI
- **Services**:  
  - `ThumbService` connects to YouTube API & handles image data  
- **Database**: MongoDB stores thumbnails, video metadata, and rankings

---

## 📈 Thumbnail Ranking Logic

This project uses the **ELO Rating System** to rank thumbnails based on user comparisons.

### 🔍 How It Works:
1. Every thumbnail starts with a base score (e.g., 1000).
2. Users are shown two thumbnails at a time and asked to pick the better one.
3. The selected (winning) thumbnail’s score increases, while the other’s decreases.
4. The amount of score change depends on the current ratings of both thumbnails.
5. Over many comparisons, thumbnails are ranked more accurately based on their visual appeal.

This method allows fair and dynamic ranking, even with a relatively small number of votes.

---

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yt-thumbnail-ranker.git
   cd yt-thumbnail-ranker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Open your browser at:
   ```
   http://localhost:3000
   ```

---

## 🙋‍♂️ How to Use

1. Upload your YouTube video URL or thumbnails manually.
2. The tool will extract thumbnails or allow you to upload custom ones.
3. You’ll get a comparison view with rankings.
4. Choose the best-performing thumbnail to use for your video!

---

## 🏁 Conclusion

This project empowers YouTube creators with **data-backed thumbnail insights**, helping them maximize their reach and engagement with minimal effort.

---

## 🤝 Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---

## 📄 License

[MIT](LICENSE)

---

## 📬 Author

Made with ❤️ by [Pratham Bhatia](https://github.com/prathambhatia)
