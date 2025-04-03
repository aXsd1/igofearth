function create_acc() {
    const name = document.getElementById('name').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessageDiv = document.getElementById('message');

    errorMessageDiv.innerText = '';

    if (!name || !lastname || !email || !password) {
        errorMessageDiv.innerText = "Please fill in all fields!";
        errorMessageDiv.style.color = "red";
        return;
    }

    fetch('./links/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  username: name,
                                lastname: lastname, 
                                email: email, 
                                password: password }),
    })
    .then(response => response.json()) // change json to text to see errors in command line
    .then(data => {
        console.log(data)
        if (data.success) {
            errorMessageDiv.innerText = "Account created successfully!";
            errorMessageDiv.style.color = "green";
            setTimeout(() => {
                window.location.href = "login.php"; // Başarı durumunda yönlendirme yap
            }, 1500);
        } else {
            errorMessageDiv.innerText = data.error || "An unknown error has occurred";
            errorMessageDiv.style.color = "red";
        }
    })
    .catch(error => {
        errorMessageDiv.innerText = 'Error: ' + error.message;
        errorMessageDiv.style.color = "red";
        console.error('An error occurred:', error);
    });
}

function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessageDiv = document.getElementById('message');

    errorMessageDiv.innerText = '';

    if (!email || !password) {
        errorMessageDiv.innerText = "Please fill in all fields!";
        errorMessageDiv.style.color = "red";
        return;
    }

    fetch('./links/signin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  email: email, 
                                password: password }),
    })
    .then(response => response.json()) // change json to text to see errors in command line
    .then(data => {
        /* console.log(data) */
        if (data.success) {
            errorMessageDiv.innerText = "Logged in successfully";
            errorMessageDiv.style.color = "green";
            setTimeout(() => {
                window.location.href = "index.php"; // Başarı durumunda yönlendirme yap
            }, 1500);
        } else {
            errorMessageDiv.innerText = data.error || "An unknown error has occurred";
            errorMessageDiv.style.color = "red";
        }
    })
    .catch(error => {
        errorMessageDiv.innerText = 'Error: ' + error.message;
        errorMessageDiv.style.color = "red";
        console.error('An error occurred:', error);
    });
}

function redirectToRegister() {
    window.location.href = 'register.php';
}
function redirectToLogin() {
    window.location.href = 'login.php';
  }