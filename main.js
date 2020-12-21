const APIKEY = 'a3ed1e37';

document.getElementById("filmEntryForm").addEventListener("submit", function(event){
    event.preventDefault();

    const film1Element = document.getElementById('film1');
    const film2Element = document.getElementById('film2');

    const fetchUrl1 = `http://www.omdbapi.com/?t=${film1Element.value}&apikey=${APIKEY}`;
    const fetchUrl2 = `http://www.omdbapi.com/?t=${film2Element.value}&apikey=${APIKEY}`;

    fetch('film1.json')
        .then(response => response.json())
        .then(data => console.log(data));

    fetch('film2.json')
        .then(response => response.json())
        .then(data => console.log(data));

    displayResults([
        {
            title: 'Director',
            members: [
                'James Gunn'
            ]
        },
        {
            title: 'Cast',
            members: [
                'Chris Pratt',
                'Zoe Saldana'
            ]
    }]);
});

function getCommonElements() {
    
}

function displayResults(results) {
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