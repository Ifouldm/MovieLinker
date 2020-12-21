const APIKEY = 'a3ed1e37';

document.getElementById("filmEntryForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const film1Element = document.getElementById('film1');
    const film2Element = document.getElementById('film2');

    const fetchUrl1 = `http://www.omdbapi.com/?t=${film1Element.value}&apikey=${APIKEY}`;
    const fetchUrl2 = `http://www.omdbapi.com/?t=${film2Element.value}&apikey=${APIKEY}`;

    // let film1Formatted = fetch('film1.json')
    //     .then(response => response.json())
    //     .then(formatData);

    // let film2Formatted = fetch('film2.json')
    //     .then(response => response.json())
    //     .then(formatData);

    getMovieData('film1.json', 'film2.json');
});

async function getMovieData(url1, url2) {
    const moviesRes = await Promise.all([
        fetch(url1),
        fetch(url2)
    ]);

    const movieJson = await Promise.all([
        moviesRes[0].json(),
        moviesRes[1].json()
    ])

    displayResults(movieJson[0], movieJson[1], getCommonElements(movieJson[0], movieJson[1]));
}

function getCommonElements(movie1, movie2) {
    return [{
            title: 'Directors',
            members: movie1.Director.split(',').filter(individual => movie2.Director.split(',').includes(individual)),
        },
        {
            title: 'Cast',
            members: movie1.Actors.split(',').filter(individual => movie2.Actors.split(',').includes(individual)),
        },
        {
            title: 'Writers',
            members: movie1.Writer.split(',').filter(individual => movie2.Writer.split(',').includes(individual)),
        }
    ];
}

function displayResults(movie1, movie2, results) {
    const resultsElement = document.getElementById('results');

    results.forEach(category => {
        const headingElement = document.createElement('h3');
        const list = document.createElement('ul');
        headingElement.textContent = category.title;
        category.members.forEach(name => {
            const listElement = document.createElement('li');
            listElement.textContent = name;
            list.appendChild(listElement);
        })
        resultsElement.appendChild(headingElement);
        resultsElement.appendChild(list);
    });
}