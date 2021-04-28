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

    var isLoginOpen = false;
    var loginToggleButton = document.getElementById("loginToggleButton");
    var loginWrapper = document.getElementById("login-form-wrapper");

    var openLoginMenu = () => {
        isLoginOpen = true;
        loginWrapper.classList.add("login-open");
        loginWrapper.classList.remove("login-closed");
        activeOverlay(true);
    }

    var closeLoginMenu = () => {
        isLoginOpen = false;
        loginWrapper.classList.remove("login-open");
        loginWrapper.classList.add("login-closed");
        activeOverlay(false);
    }

    loginToggleButton.addEventListener('click', () => {
        isLoginOpen = !isLoginOpen;
        isLoginOpen ? openLoginMenu() : closeLoginMenu();
    });

    var contactLink = loginWrapper.querySelectorAll('.login-form a')[0];
    contactLink.addEventListener('click', closeLoginMenu);

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

    /* FAQ Toggle Behaviour */

    var faqSection = document.getElementById("sectionFaq");
    var faqItems = faqSection.querySelectorAll(".faq_item");
    faqItems.forEach((faqItem) => {

        var trigger = faqItem.getElementsByClassName("faq_trigger")[0];

        trigger?.addEventListener('click', () => {
            if(!faqItem.classList.contains("faq_open")) {
                faqItems.forEach((fi) => {
                    fi.classList.remove("faq_open");
                });
                faqItem.classList.add("faq_open");
            } else {
                faqItem.classList.remove("faq_open");
            }
        });

    })

    /* End FAQ Toggle Behaviour */


}