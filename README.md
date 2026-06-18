# CourseKit Demo

CourseKit 是给 vibe coding / gstack 课程使用的最小真实项目示例。

它包含：

- 课程列表页
- 状态筛选：全部、招生中、已满、已关闭
- 当前筛选结果数量
- 导出当前筛选结果为 CSV
- 空结果状态
- 移动端响应式布局
- Node 内置单元测试

## Run

```bash
npm run dev
```

然后打开：

```text
http://localhost:5173
```

## Test

```bash
npm test
```

## Classroom Task

这是讲义里的实操项目最终版。课堂上可以把它当作：

1. 基线项目：删掉筛选/导出功能，让学生用 gstack 实现。
2. 答案项目：展示完整实现和测试应该长什么样。
3. QA 项目：故意引入 bug，让学生用 `/review` 和 `/qa` 发现问题。
