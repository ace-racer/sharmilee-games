document.addEventListener('DOMContentLoaded', () => {
    const ROWS = 4;
    const COLS = 4;
    const IMAGE_COUNT = 4;
    const IMAGE_URLS = Array.from({ length: IMAGE_COUNT }, (_, i) => `images/image${i + 1}.jpg`);

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

        const pieceWidth = puzzleContainer.clientWidth / COLS;
        const pieceHeight = puzzleContainer.clientHeight / ROWS;

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const x = col * pieceWidth;
                const y = row * pieceHeight;
                const piece = document.createElement('div');

                piece.style.backgroundImage = `url(${IMAGE_URL})`;
                piece.style.backgroundPosition = `-${x}px -${y}px`;
                piece.classList.add('piece');

                piece.style.width = `${pieceWidth}px`;
                piece.style.height = `${pieceHeight}px`;
                piece.style.top = `${Math.random() * (puzzleContainer.clientHeight - pieceHeight)}px`;
                piece.style.left = `${Math.random() * (puzzleContainer.clientWidth - pieceWidth)}px`;

                piece.dataset.correctX = `${x}px`;
                piece.dataset.correctY = `${y}px`;

                piece.addEventListener('mousedown', startDrag);
                piece.addEventListener('mouseup', dropPiece);
                piece.addEventListener('mousemove', dragPiece);

                piece.addEventListener('touchstart', startDrag);
                piece.addEventListener('touchend', dropPiece);
                piece.addEventListener('touchmove', dragPiece);

                pieces.push(piece);
                puzzleContainer.appendChild(piece);
            }
        }
    }

    function startDrag(e) {
        draggedPiece = e.target;
        draggedPiece.style.zIndex = 1000;

        if (e.type === 'touchstart') {
            const touch = e.touches[0];
            e.clientX = touch.clientX;
            e.clientY = touch.clientY;
        }
    }

    function dropPiece(e) {
        if (!draggedPiece) return;

        const correctX = parseInt(draggedPiece.dataset.correctX);
        const correctY = parseInt(draggedPiece.dataset.correctY);

        const rect = puzzleContainer.getBoundingClientRect();
        const diffX = Math.abs(correctX - (draggedPiece.offsetLeft - rect.left));
        const diffY = Math.abs(correctY - (draggedPiece.offsetTop - rect.top));

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

        if (e.type === 'touchmove') {
            const touch = e.touches[0];
            e.clientX = touch.clientX;
            e.clientY = touch.clientY;
        }

        const rect = puzzleContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - (draggedPiece.clientWidth / 2);
        const y = e.clientY - rect.top - (draggedPiece.clientHeight / 2);

        if (x < 0 || x > (puzzleContainer.clientWidth - draggedPiece.clientWidth) || y < 0 || y > (puzzleContainer.clientHeight - draggedPiece.clientHeight)) return;

        draggedPiece.style.left = `${x}px`;
        draggedPiece.style.top = `${y}px`;
    }

    createPuzzle();
});