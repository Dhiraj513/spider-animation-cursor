# 🕷️ Mouse-Following Spider

A simple React + Canvas animation where a procedurally animated spider follows your mouse cursor. The legs use basic inverse kinematics (IK) to bend naturally at a "knee" as the spider skitters around the screen.

## Features

- Smooth, physics-based body movement (velocity + damping) that eases toward the cursor
- 8 animated legs with two-segment IK for natural bending
- Legs "step" forward automatically when they drift too far from their resting position, giving a realistic skittering gait
- Built entirely with the HTML5 Canvas API inside a React component — no external animation libraries

## Demo

Move your mouse anywhere over the canvas and watch the spider follow it.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/) (build tool / dev server)
- HTML5 Canvas API

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Dhiraj513/spider-animation-cursor/
cd your-repo-name

# Install dependencies
npm install
```

### Running the app

```bash
npm run dev
```

Then open the URL printed in your terminal (usually `http://localhost:5173`).

## Project Structure

```
src/
├── App.jsx      # Main component containing the spider logic and canvas rendering
├── App.css
├── index.css
└── main.jsx
```

## How It Works

- A `spider` object tracks the body's current position, target position, velocity, and facing angle.
- On every `mousemove` event, the target position updates to the cursor's coordinates.
- Each animation frame (`requestAnimationFrame`), the body eases toward that target using simple velocity and damping.
- Each leg has a "resting spot" calculated relative to the body's position and angle. When a foot drifts too far from its resting spot, it steps to a new target position.
- Leg segments are drawn using two-segment inverse kinematics (law of cosines) to compute a natural knee bend between the hip (body) and the foot.

## Customization

You can tweak the spider's look and behavior by editing the constants and object properties near the top of the `useEffect` in `App.jsx`:

| Variable | Description |
|---|---|
| `NUM_LEGS` | Number of legs (default: 8) |
| `LEG_LENGTH_1` / `LEG_LENGTH_2` | Length of the upper/lower leg segments |
| `STEP_DISTANCE` | How far a foot can drift before it steps |
| `STEP_SPEED` | How quickly a foot moves to its new position |
| `spider.bodyRadius` / `spider.headRadius` | Size of the body and head |


