# Fashion Blog Clone

This project is a clone of a fashion blog template using **Tailwind CSS** and **Vanilla JavaScript**, featuring dynamic search, tag filtering, engagement score, and a back-to-top button.

## Features

### 1. Dynamic Search
- Users can type in the search bar to filter posts in real-time.
- Implemented using `querySelector` and `innerText.includes()`.

### 2. Engagement Score
- Clicking the "Like" button on any post increases a global score counter.
- Score logic:
```javascript
let score = 0;
function updateScore() {
    score++;
    scoreCounter.innerText = `Score: ${score}`;
    if(score >= 10) scoreCounter.style.color = 'gold';
}
