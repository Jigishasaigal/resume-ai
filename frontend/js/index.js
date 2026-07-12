document.addEventListener(
    "DOMContentLoaded",
    initializeLandingPage
);


// ========================================
// Initialize
// ========================================

function initializeLandingPage() {

    if (getToken()) {

        window.location.href =
            "dashboard.html";

        return;

    }

    enableSmoothScrolling();

    animateCards();

}


// ========================================
// Smooth Scrolling
// ========================================

function enableSmoothScrolling() {

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(anchor => {

            anchor.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const target =
                        document.querySelector(
                            this.getAttribute("href")
                        );

                    if (target) {

                        target.scrollIntoView({

                            behavior: "smooth"

                        });

                    }

                }

            );

        });

}


// ========================================
// Simple Card Animation
// ========================================

function animateCards() {

    const cards =
        document.querySelectorAll(

            ".card"

        );

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";

                        entry.target.style.transform =
                            "translateY(0)";

                    }

                });

            },

            {

                threshold: 0.15

            }

        );

    cards.forEach(card => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(40px)";

        card.style.transition =
            ".6s ease";

        observer.observe(card);

    });

}