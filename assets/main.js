const loadingElement = document.getElementById('loading');
let films;

// Populate the autocomplete dictionary
async function getAutocompleteData() {
    const filmData = await fetch('data/data.json');
    films = await filmData.json();
}

getAutocompleteData();
// Search the searchField for the given searchTerm if it exists return true
// TODO: improve comparison criteria
function search(searchTerm, searchField) {
    const sanitisedTerm = searchTerm
        .replace(/[^\w\s]|_/g, '') // Remove punctuation etc
        .trim() // Remove whitespace
        .split(' ')
        .slice(0, 2)
        .join(' '); // get first 2 words
    const regex = RegExp(sanitisedTerm, 'i');
    return regex.test(searchField);
}

// Currently only works with 2 movies
// TODO: allow multiple movies
function getCommonElements(movies) {
    return [{
        title: 'Directors',
        members: movies[0].Director.split(',').filter((individual) => search(individual, movies[1].Director)),
    },
    {
        title: 'Cast',
        members: movies[0].Actors.split(',').filter((individual) => search(individual, movies[1].Actors)),
    },
    {
        title: 'Writers',
        members: movies[0].Writer.split(',').filter((individual) => search(individual, movies[1].Writer)),
    },
    ];
}

// Create DOM elements for a list of ratings
function getRatingElement(ratings) {
    const list = document.createElement('ul');
    ratings.forEach((rating) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${rating.Source}: ${rating.Value}`;
        list.appendChild(listItem);
        list.classList.add('list');
    });
    return list;
}

// Get and populate DOM elements with relevent data
function displayResults(movies, results) {
    loadingElement.style.display = 'none';
    const overlapCard = document.getElementById('overlap');
    const cards = document.getElementsByClassName('movieCard');
    // Add each movies details to DOM
    for (let i = 0; i < movies.length; i += 1) {
        const element = movies[i];
        cards[i].getElementsByClassName('title')[0].textContent = element.Title;
        cards[i].getElementsByClassName('poster')[0].setAttribute('src', element.Poster);
        cards[i].getElementsByClassName('plot')[0].textContent = `Plot summary: ${element.Plot}`;
        cards[i].getElementsByClassName('year')[0].textContent = `Year: ${element.Year}`;
        cards[i].getElementsByClassName('runtime')[0].textContent = `Runtime: ${element.Runtime}`;
        cards[i].getElementsByClassName('rated')[0].textContent = `Rated: ${element.Rated}`;
        cards[i].getElementsByClassName('genres')[0].textContent = `Genres: ${element.Genre}`;
        cards[i].getElementsByClassName('scores')[0].innerHTML = '';
        cards[i].getElementsByClassName('scores')[0].appendChild(getRatingElement(element.Ratings));
        cards[i].getElementsByClassName('imdbLink')[0].setAttribute('href', `https://www.imdb.com/title/${element.imdbID}`);
        cards[i].style.display = 'block';
    }

    // No common elements
    if (results.every((cat) => cat.members.length === 0)) {
        const headingElement = document.createElement('h3');
        headingElement.textContent = 'No common elements found';
        overlapCard.appendChild(headingElement);
        overlapCard.style.display = 'block';
    }

    // Add common data to DOM
    results.forEach((category) => {
        if (category.members.length > 0) {
            const headingElement = document.createElement('h3');
            const list = document.createElement('ul');
            list.classList.add('list');
            headingElement.textContent = category.title;
            category.members.forEach((name) => {
                const listElement = document.createElement('li');
                listElement.textContent = name;
                list.appendChild(listElement);
            });
            overlapCard.appendChild(headingElement);
            overlapCard.appendChild(list);
            overlapCard.style.display = 'block';
        }
    });
}

// Resets the result data so that the search can re rerun
function reset() {
    const overlapCard = document.getElementById('overlap');
    const title = overlapCard.firstElementChild;
    overlapCard.innerHTML = '';
    overlapCard.appendChild(title);
}

// Asynchronous function to retreive and parse the json data for a list of urls
async function getMovieData(urls) {
    loadingElement.style.display = 'block';
    const moviesRes = await Promise.all(
        urls.map((url) => fetch(url)),
    );
    const moviesJson = await Promise.all(
        moviesRes.map((document) => document.json()),
    );
    displayResults(moviesJson, getCommonElements(moviesJson));
}

// On submit of the form
document.getElementById('filmEntryForm').addEventListener('submit', (event) => {
    event.preventDefault();

    reset();

    const filmsElements = document.getElementsByClassName('movieInput');

    const seachTerms = [...filmsElements].map((input) => input.value);

    const urls = seachTerms.map((term) => `http://www.omdbapi.com/?${term.startsWith('tt') ? 'i' : 't'}=${term}&apikey=a3ed1e37`);

    // Debug (dummy data)
    // urls = ['film1.json', 'film2.json'];

    getMovieData(urls);
});

// Autocomplete search algorthim, currently simple regex
function searchAutocomplete(req, res) {
    if (films) {
        const regex = RegExp(req.term.trim(), 'i');
        res(films.filter((film) => regex.test(film.label)));
    }
}

// eslint-disable-next-line no-undef
$('.movieInput').autocomplete({
    minLength: 3,
    source: searchAutocomplete,
});
