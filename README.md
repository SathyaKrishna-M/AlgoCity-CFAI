<div align="center">
  
# 🏙️ AlgoCity

**A highly interactive, visually stunning Graph Theory Visualization Platform.**

[![Deploy](https://github.com/SathyaKrishna-M/AlgoCity-CFAI/actions/workflows/pages/pages-build-deployment/badge.svg)](https://SathyaKrishna-M.github.io/AlgoCity-CFAI/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[**🌐 Live Demo**](https://SathyaKrishna-M.github.io/AlgoCity-CFAI/)

</div>

---

## ✨ Overview

**AlgoCity** is an advanced, real-time visualization platform that brings complex Data Structures and Algorithms (DSA) to life through the lens of modern urban infrastructure management. It leverages graph theory and advanced state management to simulate and optimize real-world smart city problems.

Built strictly with **Pure TypeScript, React, and SVG/Canvas** (zero external mapping libraries), AlgoCity provides a premium, physics-driven user experience through dark-mode aesthetics, glassmorphism, and Framer Motion animations.

## 🚀 Key Features & Modules

### 🚦 Traffic Lab (Graph Topology & Routing)
- **Interactive Graph Editor:** Dynamically add, move, and edit city nodes (hubs, hospitals, residential zones) and edges (roads) using drag-and-drop.
- **Shortest Path Algorithms:** Visualize real-time pathfinding using Dijkstra's Algorithm, A*, BFS, and DFS with step-by-step animated traversals.
- **Dynamic Weighting:** Simulate traffic congestion where road weights fluctuate dynamically.

### 🚑 Emergency Dispatch (Priority Queues)
- **Heuristic Pathfinding:** Calculates the fastest emergency routes factoring in both distance and dynamic traffic delays.
- **Max/Min-Heaps:** Prioritize emergencies based on severity and dispatch available vehicles to critical nodes.

### 🗄️ Records Database (Binary Search Trees)
- **Interactive BST:** Watch Binary Search Trees dynamically balance and restructure themselves in real-time as you insert and search for resident records.
- **Visual Traversal:** Step-by-step animations showing the comparison path when searching for or inserting nodes in the tree.

### 🏗️ Architecture & Presentation
- **Interactive Walkthroughs:** An integrated presentation layer exploring the theoretical and practical applications of Graph Theory, Trees, and Heaps within the project.
- **Architecture Visualization:** Detailed diagrams explaining the `Controller-Service-Storage` layer logic that powers the simulations.

## 🛠️ Technical Stack

- **Frontend Framework:** React 19 + Vite
- **Language:** TypeScript (Strict Mode)
- **State Management:** Zustand (for topology and non-blocking simulation step generators)
- **Styling:** Tailwind CSS v4 + Vanilla CSS (Glassmorphism, Dark Mode, Custom Gradients)
- **Animations:** Framer Motion (physics-based interactions) + Raw SVG paths
- **Deployment:** Vercel & GitHub Pages compatible (SPA routing handled natively)

## 🏎️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SathyaKrishna-M/AlgoCity-CFAI.git
   cd AlgoCity-CFAI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to explore the city!

## 📦 Deployment

The project is fully configured for deployment on **GitHub Pages** and **Vercel**. 

To deploy to GitHub pages:
```bash
npm run deploy
```
*Note: The `package.json` build script automatically generates a `404.html` for single-page routing compatibility on GitHub Pages.*

## 🧠 Core Computer Science Concepts Showcased

1. **Graph Theory:** Adjacency Lists, Weighted/Directed Edges, Dijkstra's Algorithm, Breadth-First Search (BFS), Depth-First Search (DFS).
2. **Trees:** Binary Search Trees (BST), Node Insertion, Tree Traversal (In-order, Pre-order, Post-order).
3. **Priority Queues:** Binary Heaps used for real-time task scheduling and emergency dispatching.
4. **Generator Functions:** Usage of JavaScript `function*` to yield non-blocking visualization steps to the UI frame-by-frame.

---
<div align="center">
  <i>Crafted with passion for visualizing Data Structures and Algorithms.</i>
</div>
