window.onload = () => {

    var overlay = document.getElementById("overlay");
    var activeOverlay = (active) => {
        if (active) {
            overlay.classList.remove('closed');
        } else {
            overlay.classList.add('closed');
        }
    }

    /* Login Form Toggle Behaviour */

    /* navbar-app */
    const flecha = document.getElementById('flecha-login');
    var abrirFlecha = (abrir) => {
        if(abrir) {
            flecha?.classList.add("open")
        } else {
            flecha?.classList.remove("open")
        }
    }

    var isLoginOpen = false;
    var loginToggleButton = document.getElementById("loginToggleButton");
    var loginWrapper = document.getElementById("login-form-wrapper");

    var openLoginMenu = () => {
        isLoginOpen = true;
        loginWrapper.classList.add("login-open");
        loginWrapper.classList.remove("login-closed");
        activeOverlay(true);
        abrirFlecha(true);
    }

    var closeLoginMenu = () => {
        isLoginOpen = false;
        loginWrapper.classList.remove("login-open");
        loginWrapper.classList.add("login-closed");
        activeOverlay(false);
        abrirFlecha(false);
    }


    loginToggleButton.addEventListener('click', () => {
        isLoginOpen = !isLoginOpen;
        isLoginOpen ? openLoginMenu() : closeLoginMenu();
    });


    /* End Login Form Toggle Behaviour */

    /* Menu Toggle Behaviour */

    var isMenuOpen = false;
    var menuOpenButton = document.getElementById("menuOpenButton");
    var menuCloseButton = document.getElementById("menuCloseButton");
    var menu = document.getElementById("menu-emergente");

    var openMenu = () => {
        isMenuOpen = true;
        menu.classList.add("menu-open");
        menu.classList.remove("menu-closed");
        closeLoginMenu();
        activeOverlay(true);
    }

    var closeMenu = () => {
        isMenuOpen = false;
        menu.classList.remove("menu-open");
        menu.classList.add("menu-closed");
        activeOverlay(false);
    }

    menuOpenButton.addEventListener('click', openMenu);
    menuCloseButton.addEventListener('click', closeMenu);

    var menuLinks = menu.querySelectorAll('#menu-emergente ul li a');
    menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeLoginMenu();
            closeMenu();
        });
    })

    /* End Menu Toggle Behaviour */

    closeLoginMenu();
    closeMenu();

    overlay.addEventListener('click', () => {
        if (isLoginOpen) closeLoginMenu();
        if (isMenuOpen) closeMenu();
    });

}
