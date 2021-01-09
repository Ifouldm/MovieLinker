const APIKEY = 'a3ed1e37';
const loadingElement = document.getElementById('loading');
const autocompleteJson = document.getElementById('autocompleteData');
const filmInputs = document.getElementsByClassName('filmInputs');
let films;

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
  for (let i = 0; i < ratings.length; i += 1) {
    const rating = ratings[i];
    const listItem = document.createElement('li');
    listItem.textContent = `${rating.Source}: ${rating.Value}`;
    list.appendChild(listItem);
  }
  return list;
}

function displayResults(movies, results) {
  loadingElement.style.display = 'none';
  const overlapCard = document.getElementById('overlap');
  const cards = document.getElementsByClassName('movieCard');
  // Add movie1 and movie2 data to DOM
  for (let i = 0; i < movies.length; i += 1) {
    const movie = movies[i];
    cards[i].getElementsByClassName('title')[0].textContent = movie.Title;
    cards[i].getElementsByClassName('poster')[0].setAttribute('src', movie.Poster);
    cards[i].getElementsByClassName('plot')[0].textContent = `Plot summary: ${movie.Plot}`;
    cards[i].getElementsByClassName('year')[0].textContent = `Year: ${movie.Year}`;
    cards[i].getElementsByClassName('runtime')[0].textContent = `Runtime: ${movie.Runtime}`;
    cards[i].getElementsByClassName('rated')[0].textContent = `Rated: ${movie.Rated}`;
    cards[i].getElementsByClassName('genres')[0].textContent = `Genres: ${movie.Genre}`;
    cards[i].getElementsByClassName('scores')[0].appendChild(getRatingElement(movie.Ratings));
    cards[i].getElementsByClassName('imdbLink')[0].setAttribute('href', `https://www.imdb.com/title/${movie.imdbID}`);
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

async function getMovieData(...urls) {
  loadingElement.style.display = 'block';
  const moviesRes = await Promise.all(urls.map((url) => fetch(url)));

  const moviesJson = await Promise.all(moviesRes.map((res) => res.json()));

  displayResults(moviesJson, getCommonElements(moviesJson));
}

document.getElementById('filmEntryForm').addEventListener('submit', (event) => {
  event.preventDefault();

  // VALIDATION ?

  const urls = filmInputs.map((filmInput) => `http://www.omdbapi.com/?t=${filmInput.value}&apikey=${APIKEY}`);

  getMovieData(urls);
});

autocompleteJson.addEventListener('load', () => {
  console.log('data loaded');
  films = autocompleteJson.json();
});

function search(term, response) {
  console.log(films);
  return films ? response(films.filter((a) => !a.label.toLowerCase().includes(term.toLowerCase))) : ['Loading...'];
}

$('.filmInput').autocomplete({
  minLength: 3,
  source: search,
});
