"use strict";

function toggleDarkMode() {
    const theme = localStorage.getItem("scheme");
    const toggle = document.getElementById("scheme-toggle");
    const container = document.documentElement;

    if (theme === "dark") {
        if (typeof feather !== "undefined" && toggle) {
            toggle.innerHTML = feather.icons.sun.toSvg();
        }
        container.classList.add("dark");
    } else {
        if (typeof feather !== "undefined" && toggle) {
            toggle.innerHTML = feather.icons.moon.toSvg();
        }
        container.classList.remove("dark");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    try {
        // Initialize Feather icons first
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        const globalDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const localMode = localStorage.getItem("scheme");
        const mode = document.getElementById("scheme-toggle");

        if (globalDark && (localMode === null)) {
            localStorage.setItem("scheme", "dark");
        }

        if (mode !== null) {
            // Add proper accessibility attributes
            mode.setAttribute("role", "button");
            mode.setAttribute("aria-label", "Toggle dark mode");
            mode.setAttribute("tabindex", "0");

            toggleDarkMode();

            // Handle media query changes
            if (window.matchMedia) {
                window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
                    if (event.matches) {
                        localStorage.setItem("scheme", "dark");
                    } else {
                        localStorage.setItem("scheme", "light");
                    }
                    toggleDarkMode();
                });
            }

            // Handle click events
            mode.addEventListener("click", function (e) {
                e.preventDefault();
                localStorage.setItem("scheme", document.documentElement.classList.contains('dark') ? "light" : "dark");
                toggleDarkMode();
            });

            // Handle keyboard events for accessibility
            mode.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    localStorage.setItem("scheme", document.documentElement.classList.contains('dark') ? "light" : "dark");
                    toggleDarkMode();
                }
            });
        }
    } catch (error) {
        console.warn("Theme toggle initialization failed:", error);
    }
});
