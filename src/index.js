import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries }  from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    query: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
};

let inputValue = '';

refs.query.addEventListener('input', debounce(onHandleInput, DEBOUNCE_DELAY));

function onHandleInput(e) {
    e.preventDefault();
    inputValue = e.target.value.trim();
    if (inputValue === '') {
        clearRender();
        return;
    }

    fetchCountries(inputValue)
        .then(countriesRender)
        .catch(onFetchError)
};


function clearRender() {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
}

function countriesRender(countries) {
    clearRender();
    if (countries.length > 10) {
        clearRender();
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        return;
    } else if (countries.length < 10 && countries.length > 1) {
        clearRender();
        onCountriesListCreation(countries);
        return;
    } else if (countries.length === 1) {
        clearRender();
        onCountriesCardCreation(countries);
        return;
    }    
} 

function onCountriesCardCreation(countries) {
    const langs = countries.map(({ languages }) => Object.values(languages).join(', '));
    const countryCardMarkup = countries.map(({ name, capital, population, flags }) => {
        return `<div class="card">
                    <img class="country-flag" src="${flags.svg}" alt="flag" width="38" height="24">
                    <h1 class="country-name">${name.official}</h1>
                </div>
                <p><span class="country-info__text">Capital: </span>${capital}</p>
                <p><span class="country-info__text">Population: </span>${population}</p>
                <p><span class="country-info__text">Languages: </span>${langs}</p>`
    }).join('');
    refs.info.insertAdjacentHTML('beforeend', countryCardMarkup)
}

function onCountriesListCreation(countries) {
    const countriesListMarkup = countries.map(({ name, flags }) => {
        return ` <li class="list-item" >
                    <img src="${flags.svg}" alt="flag-mini" width="32" height="20">
                    <span class="item-text">${name.official}</span>
                </li> `
    }).join('');
    refs.list.insertAdjacentHTML('beforeend', countriesListMarkup)
}

function onFetchError(error) {
    if (error) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
    }
};