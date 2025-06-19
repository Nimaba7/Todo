const api = '/api/todos';
const ul  = document.getElementById('todo-list');
const form = document.getElementById('todo-form');
const input = document.getElementById('new-task');

// 讀取並顯示 todos
async function loadTodos() {
    ul.innerHTML = '';
    const res = await fetch(api);
    const list = await res.json();
    list.forEach(renderTodo);
}

function renderTodo({ id, task, done }) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = done;
    checkbox.addEventListener('change', () => updateTodo(id, null, checkbox.checked));

    const span = document.createElement('span');
    span.textContent = task;
    span.contentEditable = true;
    if (done) span.style.textDecoration = 'line-through';

    span.addEventListener('blur', () => updateTodo(id, span.textContent, checkbox.checked));

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.addEventListener('click', () => deleteTodo(id));

    li.append(checkbox, span, delBtn);
    ul.appendChild(li);
}


// 新增一筆
form.addEventListener('submit', async e => {
    e.preventDefault();
    const task = input.value.trim();
    if (!task) return;
    await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
    });
    input.value = '';
    loadTodos();
});

async function updateTodo(id, task, done) {
    console.log('calling PUT', id, task, done);
    const body = {};
    if (task !== null)      body.task = task;
    if (done !== undefined) body.done = done;

    const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    console.log('PUT response status', res.status);
    loadTodos();
}

// 刪除
async function deleteTodo(id) {
    await fetch(`${api}/${id}`, { method: 'DELETE' });
    loadTodos();
}
loadTodos();


