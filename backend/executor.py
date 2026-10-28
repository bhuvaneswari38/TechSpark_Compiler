
import base64
import subprocess


def execute(language, code, user_input=""):
    language = (language or "").lower()
    code = code or ""
    user_input = user_input or ""

    encoded_code = base64.b64encode(
        code.encode("utf-8")
    ).decode("ascii")

    docker_options = [
        "docker", "run", "--rm", "-i",
        "--network", "none",
        "--memory", "128m",
        "--cpus", "0.5",
        "--pids-limit", "64",
    ]

    if language == "python":
        script = (
            "import base64, sys\n"
            f"source = base64.b64decode('{encoded_code}').decode('utf-8')\n"
            "try:\n"
            "    exec(compile(source, 'program.py', 'exec'))\n"
            "except Exception as exc:\n"
            "    print(f'{type(exc).__name__}: {exc}', file=sys.stderr)\n"
            "    sys.exit(1)\n"
        )

        run_cmd = docker_options + [
            "python:3.13",
            "python", "-c", script,
        ]

    elif language == "c":
        shell_script = (
            f"printf '%s' '{encoded_code}' | base64 -d > /tmp/main.c "
            "&& gcc /tmp/main.c -o /tmp/main "
            "&& /tmp/main"
        )

        run_cmd = docker_options + [
            "gcc:latest", "sh", "-lc", shell_script,
        ]

    elif language == "cpp":
        shell_script = (
            f"printf '%s' '{encoded_code}' | base64 -d > /tmp/main.cpp "
            "&& g++ /tmp/main.cpp -o /tmp/main "
            "&& /tmp/main"
        )

        run_cmd = docker_options + [
            "gcc:latest", "sh", "-lc", shell_script,
        ]

    elif language == "java":
        shell_script = (
            f"printf '%s' '{encoded_code}' | base64 -d > /tmp/Main.java "
            "&& javac /tmp/Main.java "
            "&& java -cp /tmp Main"
        )

        run_cmd = docker_options + [
            "eclipse-temurin:21-jdk", "sh", "-lc", shell_script,
        ]

    else:
        return {
            "success": False,
            "error": "Unsupported Language",
        }

    try:
        result = subprocess.run(
            run_cmd,
            input=user_input,
            capture_output=True,
            text=True,
            timeout=20,
        )

        if result.returncode != 0:
            return {
                "success": False,
                "error": result.stderr or result.stdout or "Execution failed",
            }

        return {
            "success": True,
            "output": result.stdout,
        }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": "Execution Timed Out (20 Seconds)",
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }
