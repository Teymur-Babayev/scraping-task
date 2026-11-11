function waitForElement(selector, callback, interval = 100, timeout = 5000) {
    const start = Date.now();

    const checkExist = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(checkExist);
            callback(element);
        } else if (Date.now() - start > timeout) {
            clearInterval(checkExist);
        }
    });
}

function loadLatestHash() {
    console.log("sdfsdf")
    try {
       setTimeout(() => {
            const value = document.querySelector('.tabs-content .truncate.text-right.text-secondary')?.textContent.trim();
            console.log(value);
            if (value) {
            // const value = element.textContent.trim();
            chrome.storage.local.get(["latestHash"], (result) => {
                if (result.latestHash !== value) {
                    chrome.storage.local.set({ latestHash: value }, () => {
                    });
                }
            });
        }
        }, 3000);
       
    } catch (error) {
        console.log("error")
        console.log(error)
    }
}

function captureTableChanged() {
    const table = document.querySelector('.tabs-content');
    if (table) {
        const observer = new MutationObserver(() => {
            try {
                loadLatestHash();
            } catch (error) {
                console.log(error)
            }
        });
        observer.observe(table, { childList: true, subtree: true });
    }else{
        console.log("not table")
    }
}

// function checkHistorySelected() {
//     console.log("hi")
//     waitForElement('.tabs-btn.btn-like:nth-child(1)', (btn) => {
//         if (!btn.hasAttribute('aria-selected')) {
//             console.log('history selected')
//             btn.click();
//         }
//         // loadLatestHash();
//         // captureTableChanged();
//         waitForElement('.tabs-content .lf-row', () => {
//             console.log("hi----------------")
//             loadLatestHash();
//             captureTableChanged();
//         });
//     });
// }

function checkHistorySelected() {
    const buttons = document.querySelectorAll(
        '.tabs-btn.btn-like[role="tab"]'
    );

    const btn = Array.from(buttons).find(
        el => el.textContent.trim() === 'History'
    );

    if (!btn) {
        console.log("History button not found");
        return;
    }

    console.log("History button:", btn);
    console.log("aria-selected:", btn.getAttribute('aria-selected'));

    if (btn.getAttribute('aria-selected') !== 'true') {
        btn.click();
    }
    loadLatestHash();
    captureTableChanged();
    // waitForElement('.tabs-content .lf-row', () => {
    //     console.log("History rows found");
    //     loadLatestHash();
    //     captureTableChanged();
    // });
}


setInterval(() => {
    checkHistorySelected();
}, 1000);