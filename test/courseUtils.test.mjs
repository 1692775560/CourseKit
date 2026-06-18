import assert from "node:assert/strict";
import {
  buildCsv,
  canExport,
  escapeCsvField,
  filterCourses,
  getCsvFileName,
  getResultSummary,
  getStatusLabel
} from "../src/courseUtils.js";

const sampleCourses = [
  {
    id: "a",
    title: "AI 产品课",
    owner: "林知远",
    enrolled: 8,
    capacity: 20,
    status: "open"
  },
  {
    id: "b",
    title: "Prompt Lab",
    owner: "王\"小川\"",
    enrolled: 30,
    capacity: 30,
    status: "full"
  },
  {
    id: "c",
    title: "增长实验设计",
    owner: "许嘉宁",
    enrolled: 0,
    capacity: 30,
    status: "closed"
  }
];

const tests = [
  [
    "returns all courses when status is all",
    () => {
      assert.deepEqual(filterCourses(sampleCourses, "all"), sampleCourses);
    }
  ],
  [
    "returns only courses matching the selected status",
    () => {
      assert.deepEqual(filterCourses(sampleCourses, "open"), [sampleCourses[0]]);
      assert.deepEqual(filterCourses(sampleCourses, "full"), [sampleCourses[1]]);
      assert.deepEqual(filterCourses(sampleCourses, "closed"), [sampleCourses[2]]);
    }
  ],
  [
    "reports the filtered count against the full list size",
    () => {
      assert.equal(getResultSummary(1, 3), "显示 1 / 3 门课程");
    }
  ],
  [
    "disables export when there are no filtered rows",
    () => {
      assert.equal(canExport([]), false);
      assert.equal(canExport([sampleCourses[0]]), true);
    }
  ],
  [
    "escapes commas, quotes, and line breaks",
    () => {
      assert.equal(escapeCsvField("基础课"), "基础课");
      assert.equal(escapeCsvField("AI, 产品"), '"AI, 产品"');
      assert.equal(escapeCsvField('王"小川"'), '"王""小川"""');
      assert.equal(escapeCsvField("第一行\n第二行"), '"第一行\n第二行"');
    }
  ],
  [
    "exports only the provided filtered rows",
    () => {
      const openCourses = filterCourses(sampleCourses, "open");
      const csv = buildCsv(openCourses);

      assert.match(csv, /课程名称,负责人,报名人数,容量,状态/);
      assert.match(csv, /AI 产品课,林知远,8,20,招生中/);
      assert.doesNotMatch(csv, /Prompt Lab/);
      assert.doesNotMatch(csv, /增长实验设计/);
    }
  ],
  [
    "uses localized status labels in CSV output",
    () => {
      const csv = buildCsv(sampleCourses);

      assert.match(csv, /招生中/);
      assert.match(csv, /已满/);
      assert.match(csv, /已关闭/);
      assert.equal(getStatusLabel("unknown"), "未知");
    }
  ],
  [
    "uses a stable date-based file name",
    () => {
      const date = new Date("2026-06-18T10:20:00+08:00");
      assert.equal(getCsvFileName(date), "courses-2026-06-18.csv");
    }
  ]
];

let passed = 0;

for (const [name, run] of tests) {
  run();
  passed += 1;
  console.log(`ok ${passed} - ${name}`);
}

console.log(`\n${passed}/${tests.length} tests passed`);

