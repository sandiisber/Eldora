# Eldora

## Virtual Interview App

### Description

The **Virtual Interview App** is an innovative solution designed to facilitate professional interviews through a user-friendly web interface. This project leverages AI capabilities, including natural language processing, to provide features such as:

- Professional greeting and closing messages tailored to specific interview scenarios.
- Automated generation of interview questions based on user input (e.g., language, career field).
- Real-time analysis and feedback on answers provided during the interview.
- Speech recognition and synthesis for a seamless interaction experience.

The application is built using Python, Flask, and modern front-end technologies to ensure a robust and interactive experience.

---

## Features

1. **Interactive UI**:
   - A responsive interface optimized for various devices.
   - Dark-themed design for improved aesthetics and focus.

2. **AI-Powered Interaction**:
   - Integration with OpenAI API for generating dynamic and relevant interview content.

3. **Speech Capabilities**:
   - Speech-to-text and text-to-speech functionalities for hands-free interaction.

4. **Customizability**:
   - Enables users to personalize the interview context, including language, job description, and user background.

---

## Installation

Follow these steps to set up the project locally:

### Prerequisites

Ensure the following tools and libraries are installed:

- Python (>= 3.7)
- pip (Python package manager)
---

### Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
2. **Configure Your OpenAI API Key**:
   1. **Create an OpenAI Account**:
      - Visit [OpenAI's website](https://platform.openai.com/signup/) and sign up for an account if you do not already have one.

   2. **Generate an API Key**:
      - After logging in, navigate to the [API keys page](https://platform.openai.com/account/api-keys).
      - Click **Create new secret key** and copy the generated key.

   3. **Set Up the `.env` File**:
      - In the root directory of the project, create a file named `.env` (if it doesn't already exist).
      - Add the following line to the `.env` file, replacing `your-api-key-here` with your actual API key:
        ```makefile
        OPENAI_API_KEY=your-api-key-here
        ```
      - Save the file.

   4. **Verify Your Setup**:
      - Ensure the `.env` file is in the same directory as `app.py` and that it contains the correct key.

3. **Set Up the Backend**:
   - Create a virtual environment and activate it:
     ```bash
     python -m venv venv
     ```
   - Install required Python packages:
     ```bash
     pip install flask flask-cors python-dotenv openai
     ```

4. **Run the Backend**:
   - Start the Flask server:
     ```bash
     python app.py
     ```
   - The backend server will be available at `http://127.0.0.1:5000`.

5. **Set Up the Frontend**:
   - Ensure all front-end files (`index.html`, `styles.css`, `script.js`) are in the same directory.
   - No additional setup is required for the front-end to work.

6. **Open the Application**:
   - Open `index.html` in your web browser to access the Virtual Interview App.
