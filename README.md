# 🎭 FaceVerse-AR
**Your Face is the Controller.**
*Developed by **Pranav***

FaceVerse is an interactive, browser-based Augmented Reality (AR) playground that uses your webcam and artificial intelligence to turn your facial expressions into game controllers, musical instruments, and interactive art. 

You don't need VR headsets or expensive motion-capture suits. If you have a web browser and a webcam, you can enter the FaceVerse.

---

## 🌟 What Can You Do in FaceVerse?

FaceVerse is divided into three main hubs of interactive experiences:

### 🎮 1. The Game Hub
Forget keyboards and mice. In FaceVerse, you play games using your facial muscles:
*   🏎️ **Head Tilt Racer:** Steer a high-speed car by physically tilting your head left and right. Open your mouth to trigger a massive Nitro Boost!
*   🐦 **Flappy Face:** A spin on the classic game where you flap the bird's wings by rapidly raising your eyebrows.
*   🤪 **Mimic Games (Levels 1, 2, & Chain):** An intense game of "Simon Says" where you have to mimic emojis (Smile, Wink, Frown, Angry) before the timer runs out.
*   😐 **Poker Face:** The ultimate test of willpower. Keep a completely deadpan, neutral face for 60 seconds. If you crack a smile or twitch an eyebrow, the game detects it and you lose stability.
*   🎵 **Face DJ:** Turn your face into a turntable! Pitch the music by turning your head, trigger heavy bass drops by opening your mouth, and control a synth-arpeggiator with your eyebrows. 

### 🎭 2. AR Face Filters
A collection of high-fidelity, real-time Augmented Reality masks mapped perfectly to your face using 3D rendering.
*   Try on **Cyberpunk Visors**, **Neon Skulls**, **Venom Symbiote masks**, and **Golden Crowns** that track every micro-movement of your jaw and head.

### 🧠 3. The Analyzer & Detector
Ever wonder how AI sees you? 
*   **Emotion Detector:** An intelligent dashboard that reads your micro-expressions and guesses what emotion you are feeling in real-time (Happy, Sad, Angry, Surprised, etc.).
*   **Raw Analyzer:** A developer tool that displays the raw data of your face. It tracks 52 specific "Blendshapes" (like `jawOpen`, `browInnerUp`, `mouthSmileLeft`) and displays them as live progress bars.

---

## ⚙️ How Does It Work? (The Tech Behind the Magic)

FaceVerse looks like magic, but it's built using cutting-edge web technologies:

*   **The "Eyes" (Google MediaPipe):** The core engine of FaceVerse is an AI model called MediaPipe. Through your webcam, it maps exactly **478 3D coordinates** on your face in real-time. It knows exactly when your left eye blinks or your right cheek puffs.
*   **The "Graphics" (Three.js & Canvas API):** We use advanced 3D web rendering to draw masks, wireframes, and game elements directly on top of your face with zero lag.
*   **The "Sound" (Web Audio API):** In games like Face DJ, the music isn't pre-recorded. The sounds are synthesized mathematically in real-time, allowing your physical head movements to physically alter the soundwaves.

## 🔒 100% Private & Secure
The most important feature of FaceVerse is privacy. **Zero video data is sent to the internet.** 
All of the complex Artificial Intelligence processing happens entirely *Client-Side*—meaning the AI runs directly inside your phone or computer's memory. Once you close the browser tab, the camera turns off and nothing is ever saved or transmitted.

---

## 🚀 Quick Start / How to Play
1. Open the website on a desktop or mobile browser.
2. Grant the browser permission to access your Camera.
3. Ensure you are in a well-lit room and looking directly at the screen.
4. Pick an experience from the Home Hub and start playing with your face!
