---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true
type: "journal"
status: "todo"
sprint: "{{ now.Format "2006-W01" }}"
points: 1
priority: "M"
assignee: "self"
labels: []
comments: false
tasks:
  - title: "first task"
    status: "todo"
    subtasks:
      - { title: "subtask A", done: false }
      - { title: "subtask B", done: false }
summary: ""
description: ""
---

Write the story context here. Use Markdown checkboxes if you prefer:

- [ ] Outcome 1
- [ ] Outcome 2

