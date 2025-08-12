const fs = require("fs");
const path = require("path");

const COURSE_ROOT = "./ML-For-Beginners-main";
const OUTPUT_FILE = "ml-course.json";

const IGNORED_DIRS = [
  ".devcontainer", ".github", "docs", "pdf", "images", "screenshots",
  "media", "LICENSE", "README.md"
];

const VALID_LESSON_FILES = ["README.md", "assignment.md"];
const VALID_QUIZ_FILES = ["quiz.md"];

let globalId = 1;
function getUniqueId() {
  return globalId++;
}

function capitalizeTitle(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function getMarkdownContent(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function isValidDir(name) {
  return /^\d+[-_]/.test(name) && !IGNORED_DIRS.includes(name);
}

function extractLessons(dirPath) {
  const lessons = [];
  let orderIndex = 0;
  for (const file of fs.readdirSync(dirPath)) {
    if (VALID_LESSON_FILES.includes(file)) {
      const content = getMarkdownContent(path.join(dirPath, file));
      if (content) {
        lessons.push({
          id: getUniqueId(),
          title: capitalizeTitle(path.basename(dirPath).replace(/^\d+[-_]?/, "")),
          content,
          pdfUrl: "",
          videoUrl: "",
          orderIndex: orderIndex++,
        });
      }
    }
  }
  return lessons;
}

function extractQuizzes(dirPath) {
  const quizzes = [];
  for (const file of fs.readdirSync(dirPath)) {
    if (VALID_QUIZ_FILES.includes(file)) {
      const content = getMarkdownContent(path.join(dirPath, file));
      if (content) {
        const questionText = content.trim().split("\n")[0];
        quizzes.push({
          id: getUniqueId(),
          title: "Quiz",
          questions: [
            {
              id: getUniqueId(),
              questionText,
              options: [],
              correctAnswer: "Not defined",
            },
          ],
        });
      }
    }
  }
  return quizzes;
}

function buildModuleTree(dirPath, orderIndex = 0) {
  const baseName = path.basename(dirPath);
  const module = {
    id: getUniqueId(),
    title: capitalizeTitle(baseName.replace(/^\d+[-_]?/, "")),
    orderIndex,
    lessons: extractLessons(dirPath),
    quizzes: extractQuizzes(dirPath),
    subModules: [],
  };

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.isDirectory() && isValidDir(entry.name)) {
      const sub = buildModuleTree(
        path.join(dirPath, entry.name),
        module.subModules.length
      );
      module.subModules.push(sub);
    }
  }

  return module;
}

function generateCourseJson() {
  const modules = [];
  for (const entry of fs.readdirSync(COURSE_ROOT, { withFileTypes: true })) {
    if (entry.isDirectory() && isValidDir(entry.name)) {
      const module = buildModuleTree(path.join(COURSE_ROOT, entry.name), modules.length);
      modules.push(module);
    }
  }
  return {
    id: getUniqueId(),
    title: "ML For Beginners",
    description: "Imported course: ML For Beginners",
    category: "Machine Learning",
    instructor: "Microsoft Team",
    modules,
  };
}

function logCourseTree(course, depth = 0) {
  console.log(
    `${"  ".repeat(depth)}• ${course.title} (${(course.lessons || []).length} lessons, ${(course.quizzes || []).length} quizzes, ${(course.subModules || []).length} subModules)`
  );
  for (const sub of course.subModules || []) {
    logCourseTree(sub, depth + 1);
  }
}

function main() {
  const course = generateCourseJson();
  console.log("🏷 Course outline:");
  course.modules.forEach((mod) => logCourseTree(mod));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(course, null, 2));
  console.log(`✅ JSON written to ${OUTPUT_FILE}`);
}

main();
