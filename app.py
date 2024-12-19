import openai
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Ladda miljövariabler från .env-filen
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origps": "*"}})

openai.api_key = os.getenv('OPENAI_API_KEY')

def get_openai_response(prompt):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an interview question generator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=300,
            top_p=1
        )
        return response['choices'][0]['message']['content']
    except openai.error.OpenAIError as e:
        print(f"Error communicating with OpenAI API: {e}")
        return "There was an error generating the response."



@app.route('/get-interview-greeting', methods=['POST'])
def get_interview_greeting():
    data = request.json
    language = data.get('language')
    field = data.get('field')
    user_info = data.get('user_info', 'no specific background provided')
    job_des = data.get('job_des', 'no job description provided')

    prompt = (
        f"Please create a professional greeting for a candidate who is about to begin an interview in the morning "
        f"The interview is in {language} for a role in {field}. "
        f"The candidate has the following background: {user_info}. "
        f"The job description is: {job_des}. "
        f"Make the greeting respectful, welcoming, and encouraging to make the candidate feel comfortable and confident."
        f"Limit the response to 50 words."
    )
    return jsonify(get_openai_response(prompt))

@app.route('/get-interview-thanks-and-goodbye', methods=['POST'])
def get_interview_thanks_and_goodbye():
    data = request.json
    language = data.get('language')
    field = data.get('field')
    user_info = data.get('user_info', 'no specific background provided')
    job_des = data.get('job_des', 'no job description provided')
    questions = data.get('questions', 'no questions provided')
    answers = data.get('answers', 'no answers provided')

    prompt = (
        f"Please create a professional and respectful closing message for a candidate who has just completed an interview. "
        f"The interview was conducted in {language} for a role in {field}. "
        f"The candidate has the following background: {user_info}. "
        f"The job description is: {job_des}. "
        f"The questions where: {questions}. "
        f"The answers where: {answers}. "
        f"Make the message encouraging, grateful for their time and effort, and leave a positive impression while mentioning any next steps in the process."
        f"Limit the response to 50 words."
    )
    return jsonify(get_openai_response(prompt))


@app.route('/get-interview-questions', methods=['POST'])
def get_interview_questions():
    data = request.json
    language = data.get('language')
    field = data.get('field')
    user_info = data.get('user_info', 'no specific background provided')
    job_des = data.get('job_des', 'no job description provided')
    prompt = (
        f"Create a list of 5 professional interview questions in {language} "
        f"for a candidate applying for a role in {field}. The user background is: {user_info}. "
        f"The job description: {job_des}. Respond in {language}."
        f"Limit the response to 50 words."
    )
    return jsonify({"response": get_openai_response(prompt)})
    

@app.route('/analyse-the-answer', methods=['POST'])
def analyse_the_answer():
    data = request.json
    language = data.get('language')
    field = data.get('field')
    answer = data.get('answer_value')
    prompt = (
        f"Analyze the answer: '{answer}' for the interview for a candidate applying for a role in {field}. Respond in {language}."
        f"Limit the response to 50 words."
    )
    return jsonify({"response": get_openai_response(prompt)})

if __name__ == '__main__':
    app.run(debug=True)
