import Fetch from './fetch-wrapper.js';
import { startLoader, stopLoader } from './helpers.js';

const baseURL = 'https://api.github.com';
const API = new Fetch(baseURL);
const form = document.querySelector('#repos-form');
const userName = document.querySelector('#github-username');
const list = document.querySelector('#repos-list');
const submitBtn = document.querySelector('#get-repos');

const getUserName = event => {
   event.preventDefault();
   submitBtn.setAttribute('disabled', 'disabled');
   startLoader(list);
   fetchRepos(userName.value);
};
const fetchRepos = username => {
   API.get(`/users/${username}/repos`)
      .then(data => {
         console.log(userName.value);
         stopLoader(list, '');
         if (data.message === 'Not Found') {
            throw new Error('not a valid name');
         }
         data.forEach(el => {
            const htmlString = `
                        <li> 
                        <h2> <a href="${el.html_url}" target="_blank" rel="noreferrer noopener"> ${el.full_name} </a> </h2>
                        <p> ${el.description ?? 'no description availible'} </p>
                        </li>`;
            list.insertAdjacentHTML('beforeend', htmlString);
         });
      })
      .finally(() => {
         submitBtn.removeAttribute('disabled');
      })
      .catch(err => console.error(err));
};

form.addEventListener('submit', getUserName);
