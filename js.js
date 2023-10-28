var songsData = [];
var genresData = [];

fetch('https://gist.githubusercontent.com/techniadrian/c39f844edbacee0439bfeb107227325b/raw/81eec7847b1b3dfa1c7031586405c93e9a9c1a2d/songs.json')
    .then(response => response.json())
    .then(data => {
        songsData = data;
        generateTable(songsData);
    });

fetch('https://gist.githubusercontent.com/techniadrian/6ccdb1c837d431bb84c2dfedbec2e435/raw/60783ebfa89c6fd658aaf556b9f7162553ac0729/genres.json')
    .then(response => response.json())
    .then(data => {
        genresData = data;
        generateGenreOptions(genresData);
    });

function generateTable(data) {
    const table = document.getElementById('song-table');
    const songList = document.getElementById('song-list');
    songList.innerHTML = '';

    data.forEach(song => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${song.title}</td>
            <td>${song.artists.join(', ')}</td>
            <td>${song.genre}</td>
            <td>${song.bpm}</td>
            <td>${song.duration}</td>
            <td><button class="favorite-button ${song.favorite ? 'favorite' : ''}" data-id="${song.id}">&#9733;</button></td>
        `;
        songList.appendChild(row);
    });

    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', toggleFavorite);
    });
}

function generateGenreOptions(data) {
    const genreSelect = document.getElementById('genre-select');
    data.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

function toggleFavorite(event) {
    const songId = event.target.dataset.id;
    const song = songsData.find(song => song.id === songId);

    if (song) {
        song.favorite = !song.favorite;
        generateTable(songsData);
        event.target.classList.toggle('favorite');
    }
}

function handleFavoriteButtonClick(event) {
    event.preventDefault();
    toggleFavorite(event);
    event.target.classList.toggle('favorite');
}

function filterSongs() {
    const genreSelect = document.getElementById('genre-select');
    const tempoSelect = document.getElementById('tempo-select');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    const selectedGenre = genreSelect.value;
    const selectedTempo = tempoSelect.value;
    const searchQuery = searchInput.value.toLowerCase();
    const sortOption = sortSelect.value;

    let filteredSongs = songsData.filter(song => {
        if (selectedGenre !== 'all' && song.genre !== selectedGenre) {
            return false;
        }
        if (selectedTempo === 'slow' && song.bpm >= 110) {
            return false;
        }
        if (selectedTempo === 'medium' && (song.bpm < 110 || song.bpm > 130)) {
            return false;
        }
        if (selectedTempo === 'fast' && song.bpm <= 130) {
            return false;
        }
        if (searchQuery && !song.title.toLowerCase().includes(searchQuery) && !song.artists.some(artist => artist.toLowerCase().includes(searchQuery))) {
            return false;
        }
        return true;
    });

    if (sortOption === 'asc') {
        filteredSongs.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
    } else if (sortOption === 'desc') {
        filteredSongs.sort((a, b) => parseFloat(b.duration) - parseFloat(a.duration));
    }

    generateTable(filteredSongs);
}

document.getElementById('search-input').addEventListener('input', filterSongs);

document.getElementById('filter-form').addEventListener('submit', function (e) {
    e.preventDefault();
    filterSongs();
});

window.addEventListener('load', () => {
    generateTable(songsData);
});