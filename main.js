const APIKEY = 'a3ed1e37';
const loadingElement = document.getElementById('loading');

document.getElementById("filmEntryForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const film1Element = document.getElementById('film1');
    const film2Element = document.getElementById('film2');

    const fetchUrl1 = `http://www.omdbapi.com/?t=${film1Element.value}&apikey=${APIKEY}`;
    const fetchUrl2 = `http://www.omdbapi.com/?t=${film2Element.value}&apikey=${APIKEY}`;

    getMovieData('film1.json', 'film2.json');
});

async function getMovieData(url1, url2) {
    loadingElement.style.display = 'block';
    const moviesRes = await Promise.all([
        fetch(url1),
        fetch(url2)
    ]);

    const moviesJson = await Promise.all([
        moviesRes[0].json(),
        moviesRes[1].json()
    ]);

    displayResults(moviesJson, getCommonElements(moviesJson));
}

function getCommonElements(movies) {
    return [{
            title: 'Directors',
            members: movies[0].Director.split(',').filter(individual => movies[1].Director.split(',').includes(individual)),
        },
        {
            title: 'Cast',
            members: movies[0].Actors.split(',').filter(individual => movies[1].Actors.split(',').includes(individual)),
        },
        {
            title: 'Writers',
            members: movies[0].Writer.split(',').filter(individual => movies[1].Writer.split(',').includes(individual)),
        }
    ];
}

function getRatingElement(ratings) {
    const list = document.createElement('ul');
    for (let rating of ratings) {
        const listItem = document.createElement('li');
        listItem.textContent = rating.Source + ": " + rating.Value;
        list.appendChild(listItem);
    }
    return list;
}

function displayResults(movies, results) {
    loadingElement.style.display = 'none';
    const overlapCard = document.getElementById('overlap');
    const cards = document.getElementsByClassName('movieCard');
    // Add movie1 and movie2 data to DOM
    for (let i = 0; i < movies.length; i++) {
        const element = movies[i];
        cards[i].getElementsByClassName('title')[0].textContent = movies[i].Title;
        cards[i].getElementsByClassName('poster')[0].setAttribute('src', movies[i].Poster);
        cards[i].getElementsByClassName('plot')[0].textContent = 'Plot summary: ' + movies[i].Plot;
        cards[i].getElementsByClassName('year')[0].textContent = 'Year: ' + movies[i].Year;
        cards[i].getElementsByClassName('runtime')[0].textContent = 'Runtime: ' + movies[i].Runtime;
        cards[i].getElementsByClassName('rated')[0].textContent = 'Rated: ' + movies[i].Rated;
        cards[i].getElementsByClassName('genres')[0].textContent = 'Genres: ' + movies[i].Genre;
        cards[i].getElementsByClassName('scores')[0].appendChild(getRatingElement(movies[i].Ratings));
        cards[i].getElementsByClassName('imdbLink')[0].setAttribute('href', 'https://www.imdb.com/title/' + movies[i].imdbID);
        cards[i].style.display = 'block';
    }

    // Add common data to DOM
    results.forEach(category => {
        const headingElement = document.createElement('h3');
        const list = document.createElement('ul');
        headingElement.textContent = category.title;
        category.members.forEach(name => {
            const listElement = document.createElement('li');
            listElement.textContent = name;
            list.appendChild(listElement);
        })
        overlapCard.appendChild(headingElement);
        overlapCard.appendChild(list);
        overlapCard.style.display = 'block';
    });
}