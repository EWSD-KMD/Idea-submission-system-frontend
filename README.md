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

- `/components` - React components used throughout the app (atomic design pattern)
  - `/atoms` - Smallest components (e.g., buttons, inputs, icons)
  - `/molecules` - Combinations of atoms (e.g., form groups, card elements)
  - `/organisms` - Complex components made up of molecules (e.g., navigation bar, footer)
- `/pages` - Next.js pages (each file corresponds to a route)
- `/public` - Static assets (images, fonts, etc.)
- `/styles` - Global stylesheets
- `/utils` - Utility functions and helper scripts
- `/config` - Configuration files (database, API settings, etc.)
- `/lib` - Helper libraries or third-party integrations

This structure promotes reusability and maintainability by organizing components into atomic units.

## Environment Variables

Ensure the following variables are set in your `.env.local` file:

- **NEXT_PUBLIC_API_URL:** Base URL for API endpoints.

## Deployment

### Deploying on Vercel

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
