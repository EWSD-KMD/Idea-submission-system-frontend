# University Idea Submission System

A **Next.js** web application designed for universities to enable staff (academic and support) to submit, view, comment on, and rate academic ideas. The platform facilitates seamless collaboration, feedback, and management of innovative ideas, with role-based access and robust administrative controls.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

  - [Deploying on Vercel](#deploying-on-vercel)

  ***

## Project Overview

The **University Idea Submission System** is a platform designed for university staff to submit their ideas for institutional improvements. The system supports ideas categorization, user interaction, and role-based access control. It also enables administrators to moderate content, manage users, and generate insightful reports.

### Core Features

- **Idea Submission**: Allows staff to submit ideas under different categories and with optional attachments.
- **Commenting & Rating**: Users can engage with ideas by leaving comments and providing ratings (thumbs up/down).
- **Email Notifications**: Automatic notifications are sent to users upon idea updates, new comments, or approvals.
- **Responsive Design**: The app is mobile-friendly and optimized for desktop, tablet, and mobile devices.

## Features

### Key Functionalities:

- **Idea Submission**: University staff can submit new ideas categorized by tags and departments.
- **Commenting and Rating**: Ideas can be commented on and rated (thumbs up/thumbs down) by all users based on their relevance and quality.
- **Role-Based Access Control**: Users have access to different features based on their roles.
- **Admin Features**:
  - User management (block/unblock users).
  - Category management (add/remove categories).
  - Idea moderation (hide, or delete ideas).
  - Report generation (e.g., view submission statistics).
- **Email Notifications**: Automated emails are sent for important events like new idea submissions, new comments, or updates.
- **Mobile & Desktop Optimization**: The application is fully responsive and works seamlessly across all devices.

## Getting Started

Follow these steps to get the app up and running on your local machine.

### Prerequisites

Ensure that you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **npm** or **yarn** (Package manager)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/EWSD-KMD/Idea-submission-system-frontend.git
   cd idea-submission-system

   ```

2. **Install Dependencies:**

   Using **npm**:

   bash

   Copy

   `npm install`

   Or using **Yarn**:

   bash

   Copy

   `yarn install`

3. **Start the Development Server:**

   Using **npm**:

   bash

   Copy

   `npm run dev`

   Or using **Yarn**:

   bash

   Copy

   `yarn dev`

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Running the App

- **Development Mode:** Automatically reloads on changes.

  bash

  Copy

  `npm run dev`

- **Production Mode:** Build and start the application.

  bash

  Copy

  `npm run build npm start`

# Folder Structure

The project follows the **atomic design pattern** for components and is organized as follows:

- `/components` – All React UI components organized using Atomic Design.
  - `/atoms` - SBasic, indivisible UI elements (e.g., buttons, inputs, icons).
  - `/molecules` - Combinations of atoms that work together (e.g., form inputs with labels, tags with icons).
  - `/organisms` - Complex components made from molecules (e.g., navigation bars, comment sections).
  - `/templates` - Layouts composed of multiple organisms arranged in a page-like structure (e.g., HomeLayout).
- `/pages` - Next.js pages; each file here maps to a route in the application.
- `/public` - Static assets (images, fonts, icons, favicons) accessible at runtime.
- `/styles` - Global styles, variables, or utility CSS (e.g., Tailwind config overrides).
- `/config` - Configuration files (e.g., environment setup, API routes, database config).
- `/constant` - Centralized static constants (e.g., enums, option arrays, status codes, Types).
- `/contexts` - React context providers for managing global state (e.g., AuthContext, UserContext).
- `/lib` - Helper libraries or third-party integrations(e.g., auth logics)
- `/utils` - Generic utility/helper functions (e.g., timeago, formatCount).

This structure promotes reusability and maintainability by organizing components into atomic units.

## Environment Variables

Ensure the following variables are set in your `.env.local` file:

- **NEXT_PUBLIC_API_URL:** Base URL for API endpoints.
