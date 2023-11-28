let loading = false;
let pageOffset = 0;
const resultsPerPage = 10;

document.addEventListener('DOMContentLoaded', function () {
    fetchHistory();
    setupScrollListener();
});

function fetchHistory() {
    if (loading) return;

    loading = true;
    document.getElementById('loading').style.display = 'block';

    chrome.history.search({ text: '', startTime: 0, maxResults: resultsPerPage, startTime: pageOffset }, function (data) {
        const historyList = document.getElementById('historyList');
        const groupedHistory = groupHistoryByDate(data);

        for (const [date, pages] of groupedHistory) {
            const dateHeader = document.createElement('h3');
            dateHeader.textContent = date;
            historyList.appendChild(dateHeader);

            const ul = document.createElement('ul');
            pages.forEach(function (page) {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = page.url;
                link.textContent = page.title || page.url;
                link.target = '_blank';
                li.appendChild(link);
                ul.appendChild(li);
            });

            historyList.appendChild(ul);
        }

        loading = false;
        document.getElementById('loading').style.display = 'none';
        pageOffset += resultsPerPage;
    });
}

function setupScrollListener() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                fetchHistory();
            }
        });
    }, options);

    observer.observe(document.getElementById('loading'));
}

function groupHistoryByDate(history) {
    const groupedHistory = new Map();

    history.forEach(function (page) {
        const visitDate = new Date(page.lastVisitTime);
        const formattedDate = formatDate(visitDate);

        if (!groupedHistory.has(formattedDate)) {
            groupedHistory.set(formattedDate, []);
        }

        groupedHistory.get(formattedDate).push(page);
    });

    return groupedHistory;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}
