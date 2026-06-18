export const STATUS_OPTIONS = {
  all: "全部",
  open: "招生中",
  full: "已满",
  closed: "已关闭"
};

const CSV_COLUMNS = [
  ["title", "课程名称"],
  ["owner", "负责人"],
  ["enrolled", "报名人数"],
  ["capacity", "容量"],
  ["statusLabel", "状态"]
];

export function getStatusLabel(status) {
  return STATUS_OPTIONS[status] ?? "未知";
}

export function filterCourses(courses, selectedStatus) {
  if (selectedStatus === "all") {
    return [...courses];
  }

  return courses.filter((course) => course.status === selectedStatus);
}

export function getResultSummary(filteredCount, totalCount) {
  return `显示 ${filteredCount} / ${totalCount} 门课程`;
}

export function canExport(filteredCourses) {
  return filteredCourses.length > 0;
}

export function getCsvFileName(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `courses-${yyyy}-${mm}-${dd}.csv`;
}

export function escapeCsvField(value) {
  const text = String(value ?? "");
  const shouldQuote = /[",\n\r]/.test(text);
  const escaped = text.replaceAll('"', '""');
  return shouldQuote ? `"${escaped}"` : escaped;
}

export function buildCsv(courses) {
  const header = CSV_COLUMNS.map(([, label]) => escapeCsvField(label)).join(",");
  const rows = courses.map((course) => {
    const row = {
      ...course,
      statusLabel: getStatusLabel(course.status)
    };

    return CSV_COLUMNS.map(([key]) => escapeCsvField(row[key])).join(",");
  });

  return [header, ...rows].join("\n");
}

