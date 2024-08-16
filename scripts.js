document.addEventListener('DOMContentLoaded', () => {
    const ROWS = 4;
    const COLS = 4;
    const IMAGE_URLS = [
        'images/image1.jpg',
        'images/image2.jpg',
        'images/image3.jpg',
        'images/image4.jpg'
    ];

    // Randomly select an image URL from IMAGE_URLS array
    const IMAGE_URL = IMAGE_URLS[Math.floor(Math.random() * IMAGE_URLS.length)];

    const puzzleContainer = document.getElementById('puzzleContainer');
    const successMessage = document.getElementById('successMessage');

    let pieces = [];
    let correctPieces = [];
    let draggedPiece = null;

    function createPuzzle() {
        pieces = [];
        correctPieces = [];
        puzzleContainer.innerHTML = '';

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const x = col * 100;
                const y = row * 100;
                const piece = document.createElement('div');

                piece.style.backgroundImage = `url(${IMAGE_URL})`;
                piece.style.backgroundPosition = `-${x}px -${y}px`;
                piece.classList.add('piece');

                piece.style.top = `${Math.random() * (puzzleContainer.clientHeight - 100)}px`;
                piece.style.left = `${Math.random() * (puzzleContainer.clientWidth - 100)}px`;

                piece.dataset.correctX = `${x}px`;
                piece.dataset.correctY = `${y}px`;

                piece.addEventListener('mousedown', startDrag);
                piece.addEventListener('mouseup', dropPiece);
                piece.addEventListener('mousemove', dragPiece);

                pieces.push(piece);
                puzzleContainer.appendChild(piece);
            }
        }
    }

    function startDrag(e) {
        draggedPiece = e.target;
        draggedPiece.style.zIndex = 1000;
    }

    function dropPiece() {
        if (!draggedPiece) return;

        const correctX = parseInt(draggedPiece.dataset.correctX);
        const correctY = parseInt(draggedPiece.dataset.correctY);

        const diffX = Math.abs(correctX - parseInt(draggedPiece.style.left));
        const diffY = Math.abs(correctY - parseInt(draggedPiece.style.top));

        if (diffX < 20 && diffY < 20) {
            draggedPiece.style.left = `${correctX}px`;
            draggedPiece.style.top = `${correctY}px`;
            correctPieces.push(draggedPiece);
        }

        draggedPiece.style.zIndex = 'auto';
        draggedPiece = null;

        if (correctPieces.length === pieces.length) {
            successMessage.classList.remove('hidden');
        }
    }

    function dragPiece(e) {
        if (!draggedPiece) return;
        const rect = puzzleContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - (draggedPiece.clientWidth / 2);
        const y = e.clientY - rect.top - (draggedPiece.clientHeight / 2);

        if (x < 0 || x > (puzzleContainer.clientWidth - draggedPiece.clientWidth) || y < 0 || y > (puzzleContainer.clientHeight - draggedPiece.clientHeight)) return;

        draggedPiece.style.left = `${x}px`;
        draggedPiece.style.top = `${y}px`;
    }

    createPuzzle();
});