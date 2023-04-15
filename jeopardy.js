
// Constants
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CATEGORY = 5;

// State variables
let categories = [];
let questions = {};

// DOM elements
const table = document.querySelector('#board');
const restartBtn = document.createElement('button');
restartBtn.innerText = 'Restart';

// Functions

// Retrieves an array of category IDs from the jService API
function getCategoryIds() {
  return axios.get('https://jservice.io/api/categories?count=100')
    .then(response => _.sampleSize(response.data, NUM_CATEGORIES))
    .then(categories => categories.map(category => category.id));
}

// Retrieves a category object from the jService API given a category ID
function getCategory(catID) {
  return axios.get(`https://jservice.io/api/category?id=${catID}`)
    .then(response => response.data)
    .then(category => {
      const { title, clues } = category;
      categories.push(title);
      questions[title] = _.sampleSize(clues, NUM_QUESTIONS_PER_CATEGORY);
    });
}

// Fills the table with category and question data
function fillTable() {
  table.innerHTML=""
  // Add header row with category names
  const headerRow = document.createElement('tr');
  categories.forEach(category => {
    const headerCell = document.createElement('th');
    headerCell.innerText = category.toUpperCase();
    headerRow.appendChild(headerCell);
  });
  table.appendChild(headerRow);

  // Add cells with question data
  for (let i = 0; i < NUM_QUESTIONS_PER_CATEGORY; i++) {
    const row = document.createElement('tr');
    categories.forEach(category => {
      const cell = document.createElement('td');
      const question = questions[category][i].question;
      const answer = questions[category][i].answer;
      cell.innerText = '?';
      cell.addEventListener('click', () => handleClick(cell, question, answer));
      row.appendChild(cell);
    });
    table.appendChild(row);
  }

  // Add restart button at the end
  const restartRow = document.createElement('tr');
  const restartCell = document.createElement('td');
  restartCell.colSpan = NUM_CATEGORIES;
  restartCell.appendChild(restartBtn);
  restartRow.appendChild(restartCell);
  table.appendChild(restartRow);

}

// Handles a click on a table cell
function handleClick(cell, question, answer) {
  if (cell.innerText === '?') {
    cell.innerText = question;
  } else if (cell.innerText === question) {
    cell.innerText = answer;
  }
}

// Shows a loading view while retrieving data from the API
function showLoadingView() {
  table.innerText = 'Loading...';
}

// Hides the loading view and shows the game board
function hideLoadingView() {
  table.innerText = '';
  fillTable();
}

// Sets up the game board and starts the game
function setupAndStart() {
  categories = []; //clear the categories array
  showLoadingView();
  getCategoryIds()
    .then(categoryIds => Promise.all(categoryIds.map(getCategory)))
    .then(() => hideLoadingView());
}

// Event listeners
restartBtn.addEventListener('click', setupAndStart);

// Start the game
setupAndStart();