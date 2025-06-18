const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();
const PORT = 3000;

// 中介軟體：解析 JSON、解 CORS、提供靜態檔
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// 暫存資料
let todos = [
    { id: 1, task: '幹部提報' },
    { id: 2, task: '英文作業' },
    { id: 3, task: '跟老師討論專題後續' }
];
let nextId = 3;

// 取得所有 todos
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// 新增 todo
app.post('/api/todos', (req, res) => {
    const { task } = req.body;
    if (!task) return res.status(400).json({ error: 'task 不能為空' });
    const item = { id: nextId++, task };
    todos.push(item);
    res.status(201).json(item);
});

// 修改 todo
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { task } = req.body;
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: '找不到該項目' });
    todos[idx].task = task || todos[idx].task;
    res.json(todos[idx]);
});

// 刪除 todo
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: '找不到該項目' });
    const removed = todos.splice(idx, 1)[0];
    res.json(removed);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
