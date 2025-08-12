import os
import json
import re

def parse_quiz(quiz_path):
    if not os.path.exists(quiz_path):
        return None

    with open(quiz_path, 'r', encoding='utf-8') as f:
        content = f.read()

    questions = []
    blocks = content.split("###")[1:]

    for block in blocks:
        lines = block.strip().splitlines()
        if not lines:
            continue

        question_text = lines[0].strip()
        options = []
        answer = None

        for line in lines[1:]:
            if line.strip().startswith("-"):
                clean_option = re.sub(r"-\s*[\w\)]\s*", "", line).replace("✅", "").strip()
                options.append(clean_option)
                if "✅" in line:
                    answer = clean_option

        questions.append({
            "question": question_text,
            "options": options,
            "answer": answer
        })

    return {"questions": questions}

def parse_lesson(readme_path):
    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()

    title = os.path.basename(os.path.dirname(readme_path)).replace("-", " ")
    return {
        "title": title,
        "content": content
    }

def collect_lessons_and_quizzes(module_path):
    lessons = []
    quizzes = []

    for root, dirs, files in os.walk(module_path):
        for file in files:
            full_path = os.path.join(root, file)
            if file.lower() == "readme.md":
                lesson = parse_lesson(full_path)
                if lesson:
                    lessons.append(lesson)
            elif file.lower() == "quiz.md":
                quiz = parse_quiz(full_path)
                if quiz:
                    quizzes.append(quiz)

    return lessons, quizzes

def convert_course(course_folder, title, category):
    modules = []

    for order, module_name in enumerate(sorted(os.listdir(course_folder))):
        module_path = os.path.join(course_folder, module_name)
        if os.path.isdir(module_path):
            lessons, quizzes = collect_lessons_and_quizzes(module_path)

            modules.append({
                "title": module_name.replace("-", " "),
                "orderIndex": order,
                "lessons": lessons,
                "quizzes": quizzes
            })

    return {
        "title": title,
        "description": f"Imported course: {title}",
        "category": category,
        "instructor": "Microsoft Team",
        "modules": modules
    }

# Update these
input_folder = "ML-For-Beginners-main"  # Make sure this exists
course_title = "ML For Beginners"
course_category = "Machine Learning"
output_file = "ml-course.json"

if not os.path.exists(input_folder):
    print(f"❌ Folder not found: {input_folder}")
else:
    json_data = convert_course(input_folder, course_title, course_category)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=2)

    print(f"✅ Done! Output saved to {output_file}")
