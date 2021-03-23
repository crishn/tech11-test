export * from './address-component.js';
export * from './alert-component.js';
export * from './post-direkt-service.js';

function onChallengeOneSubmit(event) {
    const components = Array.from(event.target.querySelectorAll('address-component'));
    const alert = document.querySelector('alert-component');
    alert.title = 'Form'
    alert.code = JSON.stringify(components.map(c => c.state));
    alert.show();
    event.preventDefault();
}

const challengeOne = document.querySelector('#challengeOne');
if(challengeOne) {
    challengeOne.onsubmit = onChallengeOneSubmit;
}