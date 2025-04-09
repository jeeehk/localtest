let posts = [];
let currentPage = 1;
const postPage = 10;

// DOM
const boardList = document.getElementById('boardList');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// 게시글 목록
function renderPosts() {
    const startIndex = (currentPage - 1) * postPage;
    const endIndex = startIndex + postPage;
    const pagePosts = posts.slice(startIndex, endIndex);
    
    boardList.innerHTML = pagePosts.map((post, index) => `
        <tr data-id="${post.id}">
            <td>${startIndex + index + 1}</td>
            <td>${post.title}</td>
            <td>${post.date}</td>
        </tr>
    `).join('');

    updatePagination();
}

// 페이지네이션
function updatePagination() {
    const totalPages = Math.ceil(posts.length / postPage);
    
    prevBtn.parentElement.classList.toggle('disabled', currentPage === 1);
    nextBtn.parentElement.classList.toggle('disabled', currentPage === totalPages);

    const pageNum = [];
    const pagesSet = 5;
    const currentSet = Math.ceil(currentPage / pagesSet);
    const startPage = (currentSet - 1) * pagesSet + 1;
    const endPage = Math.min(startPage + pagesSet - 1, totalPages);
    
    for (let i = startPage; i <= endPage; i++) {
        pageNum.push(i);
    }

    const pageItems = pageNum.map(pageNum => `
        <li class="page-item ${pageNum === currentPage ? 'active' : ''}">
            <button type="button" class="page-link" data-page="${pageNum}">${pageNum}</button>
        </li>
    `).join('');

    // prev와 next사이에 페이지 번호 삽입
    pagination.innerHTML = `
        <li class="page-item">
            <button type="button" class="page-link" id="prevBtn">이전</button>
        </li>
        ${pageItems}
        <li class="page-item">
            <button type="button" class="page-link" id="nextBtn">다음</button>
        </li>
    `;

    addPagination();
}

function addPagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageLinks = document.querySelectorAll('.page-link[data-page]');

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const totalPages = Math.ceil(posts.length / postPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
        }
    });

    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageNum = parseInt(e.target.dataset.page);
            if (pageNum !== currentPage) {
                currentPage = pageNum;
                renderPosts();
            }
        });
    });
}

// 게시글 클릭 이벤트 처리
boardList.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (row) {
        const postId = parseInt(row.dataset.id);
        const post = posts.find(p => p.id === postId);
        if (post) {
            // 게시글 상세 내용 표시
            const boardWrite = document.querySelector('.board-write');
            boardWrite.innerHTML = `
                <h2>${post.title}</h2>
                <p>작성일: ${post.date}</p>
                <div class="content">${post.content}</div>
            `;
        }
    }
});

// 데이터 로드
async function loadPost() {
    const response = await fetch('/data/boardData.json');
    posts = await response.json();
    renderPosts();
}

// 초기 데이터 로드
document.addEventListener('DOMContentLoaded', () => {
    loadPost();
}); 