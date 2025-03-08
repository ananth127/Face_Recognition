# React + Vite
# Face Recognition Application

This is a React application for registering faces and performing face recognition using the `face-api.js` library and a webcam. Users can capture images directly from their webcam or upload images for registration.

## Live Demo

You can check out the live demo [here](https://face-recognition-g9tw.vercel.app/).

## Features

- Capture images from a webcam.
- Upload images from local storage.
- Register faces with a username.
- Uses `face-api.js` for face detection and recognition.
- Connects to a backend API for saving face descriptors.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/get-npm) (Node package manager)

## Installation

Follow these steps to set up the project locally:

### 1. Clone the Repository

Open your terminal and run the following command:

```bash
git clone <repository-url>

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
