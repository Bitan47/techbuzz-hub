function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
    }
}

function trackGoogleAdsConversion(label) {
    if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", {
            send_to: "AW-XXXXXXXXXX/" + label
        });
    }
}

function setupTrackedClicks() {
    const trackedElements = document.querySelectorAll("[data-track]");

    trackedElements.forEach((element) => {
        element.addEventListener("click", () => {
            const label = element.dataset.track;
            trackEvent("cta_click", {
                click_label: label,
                page_path: window.location.pathname
            });

            if (element.dataset.conversion === "true") {
                trackGoogleAdsConversion(label);
            }
        });
    });
}

function setupTrackedForms() {
    const newsletterForm = document.getElementById("newsletterForm");
    const contactForm = document.getElementById("contactForm");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const emailField = newsletterForm.querySelector("input[type='email']");
            const email = emailField ? emailField.value.trim() : "";
            const status = document.getElementById("newsletterStatus");

            trackEvent("newsletter_signup", {
                email_domain: email.includes("@") ? email.split("@")[1] : "unknown"
            });
            trackGoogleAdsConversion("newsletter_signup");

            if (status) {
                status.textContent = "Thanks for subscribing. Fresh stories will land in your inbox soon.";
            }

            newsletterForm.reset();
        });
    }

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = document.getElementById("name")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const message = document.getElementById("message")?.value.trim() || "";
            const status = document.getElementById("formStatus");

            trackEvent("contact_form_submit", {
                contact_name: name,
                email_domain: email.includes("@") ? email.split("@")[1] : "unknown",
                message_length: message.length
            });
            trackGoogleAdsConversion("contact_form_submit");

            if (status) {
                status.textContent = "Message received. The editorial desk will be in touch soon.";
            }

            contactForm.reset();
        });
    }
}

function setupSectionViews() {
    const sections = document.querySelectorAll("[data-section]");

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                trackEvent("section_view", {
                    section_name: entry.target.dataset.section
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.35 });

    sections.forEach((section) => observer.observe(section));
}

function setupRevealAnimation() {
    const items = document.querySelectorAll(".story-card, .mini-card, .article-card, .trend-card, .tool-card, .contact-card, .ad-card, .newsletter");

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });

    items.forEach((item) => {
        item.classList.add("reveal");
        observer.observe(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupTrackedClicks();
    setupTrackedForms();
    setupSectionViews();
    setupRevealAnimation();

    trackEvent("page_ready", {
        page_title: document.title,
        page_path: window.location.pathname
    });
});
