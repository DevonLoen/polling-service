# Polling Service for Mata Kuliah DevOps

This guide will walk you through setting up and running the project locally.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Node.js** (v18.x or later recommended) - [Download & Install Node.js](https://nodejs.org/en/download/)
* **Docker & Docker Compose** - [Install Docker](https://docs.docker.com/engine/install/)

---

## ⚙️ Installation & Setup

Follow these steps to get your development environment running.

1.  **Clone the Repository**

    First, clone this repository to your local machine.

    ```bash
    git clone https://github.com/DevonLoen/polling-service.git
    ```

2.  **Install NPM Dependencies**

    Install all the required packages using npm.

    ```bash
    npm i
    ```

3.  **Set Up Environment Variables**

    Create a local environment file by copying the sample file.

    ```bash
    cp .env.sample .env
    ```

    Now, open the `.env` file and customize the variables as needed. The default values are already provided for a standard local setup.

4.  **Start Services with Docker**

    This command will build and start the containers required for the project (like a database) in the background.

    ```bash
    docker compose up -d
    ```

5.  **Run the Application**

    Finally, start the application in development mode. This will typically enable features like hot-reloading.

    ```bash
    npm run start:dev
    ```

    The application should now be running! You can access it at `http://localhost:PORT`, where `PORT` is the port number specified in your `.env` file. 🎉
