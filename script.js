// Асинхронная функция для получения данных и отображения их в виде таблицы
async function fetchAndDisplayPosts() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();

    // Глобальная переменная для хранения всех постов
    window.posts = posts;
    window.filteredPosts = posts; // Хранение отфильтрованных постов

    displayPosts(posts);
}

// Функция для отображения постов в таблице
function displayPosts(posts) {
    const tableBody = document.getElementById('tableBody');

    tableBody.innerHTML = '';

    posts.forEach(post => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${post.id}</td><td>${post.title}</td><td>${post.body}</td>`;
        tableBody.appendChild(row);
    });
}

// Функция для фильтрации таблицы на основе ввода
function filterTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();

    if (filter.length < 3) {
        // Если строка поиска меньше трех символов, обнуляем filteredPosts
        window.filteredPosts = window.posts;
    } else {
        window.filteredPosts = window.posts.filter(post =>
            post.title.toLowerCase().includes(filter) || post.body.toLowerCase().includes(filter)
        );
    }

    displayPosts(window.filteredPosts);
    document.getElementById('noMatch').style.display = window.filteredPosts.length === 0 ? 'block' : 'none';
}

let sortOrder = true; // true - по возрастанию, false - по убыванию

function sortTable(columnIndex) {
    const sortedPosts = [...window.filteredPosts]; // Сортируем отфильтрованные данные

    sortedPosts.sort((a, b) => {
        if (columnIndex === 0) { // ID
            return sortOrder ? a.id - b.id : b.id - a.id;
        } else if (columnIndex === 1) { // Title
            return sortOrder ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (columnIndex === 2) { // Body
            return sortOrder ? a.body.localeCompare(b.body) : b.body.localeCompare(a.body);
        }
        return 0;
    });

    displayPosts(sortedPosts);
    sortOrder = !sortOrder;
}

// Обработчик событий для поля ввода поиска
document.getElementById('searchInput').addEventListener('input', () => {
    filterTable();
});

document.querySelectorAll('th').forEach((header, index) => {
    header.addEventListener('click', () => sortTable(index));
});

document.addEventListener('DOMContentLoaded', fetchAndDisplayPosts);