const API_BASE_URL = 'http://localhost:8000/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    loadGroups();
    loadStudents();

    document.getElementById('apply-filters').addEventListener('click', loadStudents);
});

async function loadGroups() {
    try {
        const response = await fetch(`${API_BASE_URL}/groups/`);
        if (!response.ok) throw new Error('Ошибка загрузки групп');
        const data = await response.json();
        
        // В DRF пагинация возвращает массив в results
        const groups = data.results || data;
        const groupSelect = document.getElementById('group-select');
        
        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.group_name;
            option.textContent = group.group_name;
            groupSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function loadStudents() {
    const groupName = document.getElementById('group-select').value;
    const isCurrentlyStudy = document.getElementById('currently-study-checkbox').checked;
    const hasContacts = document.getElementById('has-contacts-checkbox').checked;

    let url = `${API_BASE_URL}/users/?`;
    
    if (groupName) url += `group_name=${encodeURIComponent(groupName)}&`;
    if (isCurrentlyStudy) url += `is_currently_study=True&`;
    if (hasContacts) url += `has_contacts=True&`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка загрузки студентов');
        const data = await response.json();
        
        const students = data.results || data;
        renderStudents(students);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function renderStudents(students) {
    const tbody = document.querySelector('#students-table tbody');
    tbody.innerHTML = '';

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Нет данных</td></tr>';
        return;
    }

    students.forEach(student => {
        const tr = document.createElement('tr');
        
        const contacts = [];
        if (student.contacts?.email) contacts.push(`Email: ${student.contacts.email}`);
        if (student.contacts?.phone) contacts.push(`Тел: ${student.contacts.phone}`);
        if (student.contacts?.tg_name) contacts.push(`TG: ${student.contacts.tg_name}`);
        
        // DRF user_group is returned as an ID in the basic view unless nested.
        // Let's assume the API returns the group ID or we just handle it properly.
        const groupDisplay = student.user_group || '-';

        tr.innerHTML = `
            <td>${student.first_name || '-'}</td>
            <td>${student.last_name || '-'}</td>
            <td>${groupDisplay}</td>
            <td>${contacts.join('<br>') || 'Нет контактов'}</td>
        `;
        tbody.appendChild(tr);
    });
}
