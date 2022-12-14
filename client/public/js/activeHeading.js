const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const ticketMores = $$('.ticket-price__more');
const moreInformations = $$('.ticket__information-details');

var tabs = $$('.ticket__information-details-heading-item');
// console.log("Check1", tabs)
const lines = $$('.ticket__information-details-heading .line');
// var line;
// console.log(lines);

ticketMores.forEach((ticketMore, index) => {
    var moreInformation = moreInformations[index];
    const line = lines[index];
    ticketMore.onclick = function() {
        console.log(moreInformation);
        var isActive = moreInformation.classList.contains('active');
        if (isActive) {
            moreInformation.classList.remove('active');
        } else {
            var current = $('.ticket__information-details.active');
            if (current != null) {
                current.classList.remove('active');
            }
            moreInformation.classList.add('active');
            tabs = $$('.ticket__information-details.active .ticket__information-details-heading-item');
        }


        const tabDetails = $$('.ticket__information-details.active .content-detail');
        const tabActive = $('.ticket__information-details-heading-item.active');

        line.style.left = tabActive.offsetLeft + 'px';
        line.style.width = tabActive.offsetWidth + 'px';

        tabs.forEach((tab, index) => {
            const tabDetail = tabDetails[index];
            // const ticketMore = ticketMores[index];
            tab.onclick = function() {
                $('.ticket__information-details-heading-item.active').classList.remove('active');
                $('.content-detail.active').classList.remove('active');

                line.style.left = this.offsetLeft + 'px';
                line.style.width = this.offsetWidth + 'px';
                console.log("OffsetLeft: ", this.offsetLeft);
                console.log("OffsetWidth: ", this.offsetWidth);
                this.classList.add('active');
                tabDetail.classList.add('active');
            }
        })
    }
})

// var tabs = $$('.ticket__information-details.active .ticket__information-details-heading-item');
// console.log(tabs);
// const tabDetails = $$('.content-detail');
// const tabActive = $('.ticket__information-details-heading-item.active');

// line.style.left = tabActive.offsetLeft + 'px';
// line.style.width = tabActive.offsetWidth + 'px';

// tabs.forEach((tab, index) => {
//     const tabDetail = tabDetails[index];
//     // const ticketMore = ticketMores[index];
//     tab.onclick = function() {
//         $('.ticket__information-details-heading-item.active').classList.remove('active');
//         $('.content-detail.active').classList.remove('active');

//         line.style.left = this.offsetLeft + 'px';
//         line.style.width = this.offsetWidth + 'px';
//         console.log("OffsetLeft: ", this.offsetLeft);
//         console.log("OffsetWidth: ", this.offsetWidth);
//         this.classList.add('active');
//         tabDetail.classList.add('active');
//     }
// })