from flask import Flask, request, jsonify
from flask_cors import CORS
from executor import execute

app = Flask(__name__)
CORS(app)


@app.route("/deploy", methods=["POST"])
def deploy():

    try:
        data = request.get_json()

        language = data.get("language", "python")
        code = data.get("code", "")
        user_input = data.get("input", "")

        result = execute(language, code, user_input)

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        })


@app.route("/")
def home():

    return jsonify({
        "message": "TechSpark Backend Running ✅"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)