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


