document.addEventListener('DOMContentLoaded', function() {
    displayNotes();
});

function saveNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteInput').value;
    
    if (!title || !content) {
        alert('请输入标题和内容！');
        return;
    }

    const note = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleString()
    };

    // 获取现有笔记
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    
    // 保存到本地存储
    localStorage.setItem('notes', JSON.stringify(notes));
    
    // 清空输入框
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteInput').value = '';
    
    // 刷新显示
    displayNotes();
}

function displayNotes() {
    const notesList = document.getElementById('notesList');
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    
    notesList.innerHTML = notes.map(note => `
        <div class="note-card">
            <div class="note-header">
                <h3>${note.title}</h3>
                <span class="note-date">${note.date}</span>
            </div>
            <p>${note.content}</p>
            <div class="note-actions">
                <button onclick="editNote(${note.id})" class="edit-button">编辑</button>
                <button onclick="deleteNote(${note.id})" class="delete-button">删除</button>
            </div>
        </div>
    `).join('');
}

function deleteNote(id) {
    if (!confirm('确定要删除这条笔记吗？')) return;
    
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
    
    displayNotes();
}

function editNote(id) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find(n => n.id === id);
    
    if (note) {
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteInput').value = note.content;
        
        // 删除原笔记
        deleteNote(id);
        
        // 滚动到编辑区
        document.querySelector('.note-editor').scrollIntoView({ behavior: 'smooth' });
    }
} 