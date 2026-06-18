import { courses } from "./courses.js";
import {
  buildCsv,
  canExport,
  filterCourses,
  getCsvFileName,
  getResultSummary,
  getStatusLabel
} from "./courseUtils.js";

const statusFilter = document.querySelector("#status-filter");
const resultCount = document.querySelector("#result-count");
const exportButton = document.querySelector("#export-button");
const table = document.querySelector("#course-table");
const tableBody = document.querySelector("#course-table-body");
const emptyState = document.querySelector("#empty-state");
const updatedAt = document.querySelector("#updated-at");

let currentCourses = [];

function renderCourses(selectedStatus) {
  currentCourses = filterCourses(courses, selectedStatus);
  tableBody.replaceChildren();

  for (const course of currentCourses) {
    const row = document.createElement("tr");
    row.append(
      createCell("课程名称", course.title),
      createCell("负责人", course.owner),
      createCell("报名人数", course.enrolled),
      createCell("容量", course.capacity),
      createStatusCell(course.status)
    );
    tableBody.append(row);
  }

  const hasRows = currentCourses.length > 0;
  resultCount.value = getResultSummary(currentCourses.length, courses.length);
  exportButton.disabled = !canExport(currentCourses);
  emptyState.hidden = hasRows;
  table.hidden = !hasRows;
}

function createCell(label, value) {
  const cell = document.createElement("td");
  cell.dataset.label = label;
  cell.textContent = String(value);
  return cell;
}

function createStatusCell(status) {
  const cell = document.createElement("td");
  cell.dataset.label = "状态";

  const pill = document.createElement("span");
  pill.className = `status-pill status-${status}`;
  pill.textContent = getStatusLabel(status);
  cell.append(pill);

  return cell;
}

function exportCurrentCourses() {
  if (!canExport(currentCourses)) {
    return;
  }

  const csv = buildCsv(currentCourses);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getCsvFileName();
  link.click();
  URL.revokeObjectURL(url);
}

statusFilter.addEventListener("change", (event) => {
  renderCourses(event.target.value);
});

exportButton.addEventListener("click", exportCurrentCourses);

updatedAt.textContent = `更新于 ${new Intl.DateTimeFormat("zh-CN", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date())}`;

renderCourses(statusFilter.value);
