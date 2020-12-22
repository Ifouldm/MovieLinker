const APIKEY = 'a3ed1e37';
const loadingElement = document.getElementById('loading');

const films = [{
    value: 'tt0111161',
    label: 'The Shawshank Redemption (1994)',
},
{
    value: 'tt0468569',
    label: 'The Dark Knight (2008)',
},
{
    value: 'tt1375666',
    label: 'Inception (2010)',
},
{
    value: 'tt0137523',
    label: 'Fight Club (1999)',
},
{
    value: 'tt0110912',
    label: 'Pulp Fiction (1994)',
},
{
    value: 'tt0109830',
    label: 'Forrest Gump (1994)',
},
];

// Currently only works with 2 movies
// TODO: allow multiple movies
function getCommonElements(movies) {
    return [{
        title: 'Directors',
        members: movies[0].Director.split(',').filter((individual) => movies[1].Director.split(',').includes(individual)),
    },
    {
        title: 'Cast',
        members: movies[0].Actors.split(',').filter((individual) => movies[1].Actors.split(',').includes(individual)),
    },
    {
        title: 'Writers',
        members: movies[0].Writer.split(',').filter((individual) => movies[1].Writer.split(',').includes(individual)),
    },
    ];
}

function getRatingElement(ratings) {
    const list = document.createElement('ul');

    ratings.forEach((rating) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${rating.Source}: ${rating.Value}`;
        list.appendChild(listItem);
    });

    // for (const rating of ratings) {
    //     const listItem = document.createElement('li');
    //     listItem.textContent = `${rating.Source}: ${rating.Value}`;
    //     list.appendChild(listItem);
    // }
    return list;
}

function displayResults(movies, results) {
    loadingElement.style.display = 'none';
    const overlapCard = document.getElementById('overlap');
    const cards = document.getElementsByClassName('movieCard');
    // Add movie1 and movie2 data to DOM
    for (let i = 0; i < movies.length; i += 1) {
        const element = movies[i];
        cards[i].getElementsByClassName('title')[0].textContent = element.Title;
        cards[i].getElementsByClassName('poster')[0].setAttribute('src', element.Poster);
        cards[i].getElementsByClassName('plot')[0].textContent = `Plot summary: ${element.Plot}`;
        cards[i].getElementsByClassName('year')[0].textContent = `Year: ${element.Year}`;
        cards[i].getElementsByClassName('runtime')[0].textContent = `Runtime: ${element.Runtime}`;
        cards[i].getElementsByClassName('rated')[0].textContent = `Rated: ${element.Rated}`;
        cards[i].getElementsByClassName('genres')[0].textContent = `Genres: ${element.Genre}`;
        cards[i].getElementsByClassName('scores')[0].appendChild(getRatingElement(element.Ratings));
        cards[i].getElementsByClassName('imdbLink')[0].setAttribute('href', `https://www.imdb.com/title/${element.imdbID}`);
        cards[i].style.display = 'block';
    }

    // Add common data to DOM
    results.forEach((category) => {
        const headingElement = document.createElement('h3');
        const list = document.createElement('ul');
        headingElement.textContent = category.title;
        category.members.forEach((name) => {
            const listElement = document.createElement('li');
            listElement.textContent = name;
            list.appendChild(listElement);
        });
        overlapCard.appendChild(headingElement);
        overlapCard.appendChild(list);
        overlapCard.style.display = 'block';
    });
}

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

document.getElementById('filmEntryForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const filmsElements = document.getElementsByClassName('movieInput');

    const seachTerms = [...filmsElements].map((input) => input.value);

    const urls = seachTerms.map((term) => `http://www.omdbapi.com/?${term.startsWith('tt') ? 'i' : 't'}=${term}&apikey=${APIKEY}`);

    getMovieData(['film1.json', 'film2.json']);
});

function searchAutocomplete(term) {
    return films.filter((a) => a.label.toLowerCase().includes(term.toLowerCase));
}

// eslint-disable-next-line no-undef
$('#film1').autocomplete({
    minLength: 3,
    source: searchAutocomplete,
});

// eslint-disable-next-line no-undef
$('#film2').autocomplete({
    minLength: 3,
    source: searchAutocomplete,
});
