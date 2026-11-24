"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGithub = exports.QUERY_LAST_PATH_SEGMENT = exports.QUERY_PJAX_CONTAINER = exports.QUERY_PATH_SEGMENTS = exports.QUERY_FILE_TABLE_ITEMS = void 0;
const Icons_1 = require("../utils/Icons");
const github_url_detection_1 = require("github-url-detection");
const PageDetect_1 = require("../utils/PageDetect");
const fastdom = require("fastdom");
const Dev_1 = require("../utils/Dev");
const selector_observer_1 = require("selector-observer");
exports.QUERY_FILE_TABLE_ITEMS = '[aria-labelledby="folders-and-files"] tr';
exports.QUERY_PATH_SEGMENTS = '.repository-content .js-path-segment a';
exports.QUERY_PJAX_CONTAINER = 'main';
exports.QUERY_LAST_PATH_SEGMENT = '.final-path';
function createIconElement(iconPath) {
    const image = document.createElement('img');
    image.setAttribute('src', (0, Icons_1.getIconUrl)(iconPath));
    image.setAttribute('alt', 'icon');
    image.setAttribute('class', 'vscode-icon');
    return image;
}
function createTextSpan(text) {
    const span = document.createElement('span');
    span.textContent = ` ${text}`;
    return span;
}
/**
 * Show icon for path segments
 */
function showIconsForSegments() {
    if (!((!(0, github_url_detection_1.isRepoRoot)() && (0, github_url_detection_1.isRepoTree)()) || (0, github_url_detection_1.isSingleFile)() || (0, PageDetect_1.isHistoryForFile)()))
        return;
    const aSegments = document.querySelectorAll(exports.QUERY_PATH_SEGMENTS);
    const firstSegment = aSegments[0];
    const finalSegment = document.querySelector(exports.QUERY_LAST_PATH_SEGMENT);
    // first segment has always root folder icon
    if (firstSegment) {
        const spanEl = firstSegment.children[0];
        const text = spanEl.innerText;
        spanEl.replaceChildren(createIconElement(Icons_1.DEFAULT_ROOT_OPENED), createTextSpan(text));
    }
    // check if final segment is file or folder
    if (finalSegment) {
        const iconPath = window.location.href.includes('/blob/')
            ? (0, Icons_1.getIconForFile)(finalSegment.innerText)
            : (0, Icons_1.getIconForOpenFolder)(finalSegment.innerText);
        if (iconPath) {
            const text = finalSegment.innerText;
            finalSegment.replaceChildren(createIconElement(iconPath), createTextSpan(text));
        }
    }
    // segments between first and last are always folders
    for (let i = 1; i < aSegments.length; i++) {
        const spanEl = aSegments[i];
        const aEl = spanEl.firstChild;
        const iconPath = (0, Icons_1.getIconForOpenFolder)(aEl.innerText);
        const text = aEl.innerText;
        aEl.replaceChildren(createIconElement(iconPath), createTextSpan(text));
    }
}
const ICON_SIZE = 18;
function getHtmlIcon(iconPath, svgElem) {
    return `<img src="${(0, Icons_1.getIconUrl)(iconPath)}" class="vscode-icon ${svgElem ? svgElem.className.baseVal : ''}" alt="icon" width="${ICON_SIZE}" height="${ICON_SIZE}">`;
}
/**
 * Show icons for repository files (legacy view)
 */
function showRepoTreeIcons(rowEl) {
    const iconSVGEl = [...rowEl.querySelectorAll('svg')];
    if (!iconSVGEl.length) {
        // can be mobile button or header
        // console.warn(`[vscode-icons] Error during parsing: can't find any SVGs in main file tree view`);
        return;
    }
    /**
     * <div role="row">
     *  <div><svg class={{icon}}/></div>,
     *  <div><span><a>{{name}}</a></span></div>,
     *  <div><span><a>{{message}}</a></span></div>,
     *  <div><span>{time}</span><s/div>,
     * </div>
     */
    const contentEl = rowEl.children[1];
    if (!contentEl)
        return;
    const fileText = contentEl.innerText.toLowerCase().trim();
    let iconPath = '';
    if (iconSVGEl) {
        const isDirectory = rowEl.querySelector('[aria-label*="Directory"]');
        const isSubmodule = rowEl.querySelector('[aria-label*="Submodule"]');
        if (isSubmodule) {
            // if (isDirectory) {
            iconPath = (0, Icons_1.getIconForFolder)('submodules');
            // } else {
            //   iconPath = DEFAULT_FILE;
            // }
        }
        else if (!isDirectory) {
            iconPath = (0, Dev_1.getFileIcon)(fileText);
        }
        else if (isDirectory) {
            const name = fileText;
            iconPath = (0, Dev_1.getFolderIcon)(name.split('/').shift());
        }
        if (!iconPath)
            return;
        for (const svg of iconSVGEl) {
            fastdom.mutate(() => {
                // detect if detached node
                if (!svg.parentElement)
                    return;
                svg.outerHTML = getHtmlIcon(iconPath, svg);
            });
        }
    }
    // else {
    //   console.error(`Error during parsing: "td.icon > svg.octoicon" doesnt exists for ${i}. row`);
    // }
}
function isNavSidebarSvgShouldBeIgnored(svg) {
    const className = svg.className.baseVal.toLowerCase();
    return className.includes('spinner') || className.includes('chevron');
}
function newShowRepoTreeIcons(row) {
    const fileName = row.querySelector('a')?.textContent?.toLowerCase();
    if (!fileName || fileName === '..')
        return;
    const iconElems = row.querySelectorAll('.react-directory-filename-column > svg, .react-directory-filename-column > svg');
    for (const iconEl of iconElems) {
        const linkToFile = row.querySelector('a').href;
        let iconPath;
        const linkUrl = new URL(linkToFile, window.location.href);
        if ((0, github_url_detection_1.isSingleFile)(linkUrl)) {
            iconPath = (0, Dev_1.getFileIcon)(fileName);
        }
        else if ((0, github_url_detection_1.isRepoTree)(linkUrl)) {
            iconPath = (0, Dev_1.getFolderIcon)(fileName.split('/').shift());
        }
        else {
            // Unknown GitHub link types are intentionally ignored.
        }
        if (iconPath) {
            fastdom.mutate(() => {
                if (!iconEl.parentElement)
                    return;
                iconEl.outerHTML = getHtmlIcon(iconPath, iconEl);
            });
        }
    }
}
function newShowRepoTreeIconsFileSearchResult(row) {
    const fileName = row.children[0]?.children?.[0].textContent?.toLowerCase();
    if (!fileName)
        return;
    const a = row.closest('a');
    if (hasVscodeIcon(a))
        return;
    const iconEl = a.querySelector('svg');
    const iconPath = (0, Dev_1.getFileIcon)(fileName);
    if (!iconPath || !iconEl)
        return;
    fastdom.mutate(() => {
        if (!iconEl.parentElement)
            return;
        iconEl.outerHTML = getHtmlIcon(iconPath);
        const justInsertedIcon = a.querySelector('.vscode-icon');
        justInsertedIcon.style.marginRight = '3px';
        justInsertedIcon.style.marginTop = '3px';
    });
}
function globalSearchResult(row) {
    const label = row.querySelector('.ActionListItem-label > span') ?? row.querySelector('.ActionListItem-label');
    if (!label)
        return;
    // for constants use description
    const fileNameEl = label.children.length > 1 ? row.querySelector('.ActionListItem-description') : label;
    if (!fileNameEl)
        return;
    const iconEl = row.querySelector('svg');
    if (!iconEl || iconEl.classList.contains('vscode-icon'))
        return;
    const iconPath = (0, Dev_1.getFileIcon)(fileNameEl.textContent.trim());
    if (!iconPath)
        return;
    fastdom.mutate(() => {
        if (!iconEl.parentElement)
            return;
        iconEl.outerHTML = getHtmlIcon(iconPath);
        const justInsertedIcon = row.querySelector('.vscode-icon');
        justInsertedIcon.style.marginRight = '3px';
        justInsertedIcon.style.marginTop = '3px';
    });
}
function hasVscodeIcon(container) {
    return [...container.children].some((elem) => elem.classList.contains('vscode-icon'));
}
function newShowRepoTreeIconsCommandPallete(row) {
    const fileName = (row.querySelector('[data-target="command-palette-item.titleElement"]') ??
        row.querySelector('span')).textContent.toLowerCase();
    if (fileName === '..')
        return;
    const linkToFile = row.querySelector('a').href;
    let iconPath;
    const linkUrl = new URL(linkToFile, window.location.href);
    if ((0, github_url_detection_1.isSingleFile)(linkUrl)) {
        iconPath = (0, Dev_1.getFileIcon)(fileName);
    }
    else if ((0, github_url_detection_1.isRepoTree)(linkUrl)) {
        iconPath = (0, Dev_1.getFolderIcon)(fileName.split('/').shift());
    }
    else {
        // Unknown GitHub link types are intentionally ignored.
    }
    if (iconPath) {
        fastdom.mutate(() => {
            const iconEl = row.querySelector('svg');
            if (!iconEl.parentElement)
                return;
            iconEl.outerHTML = getHtmlIcon(iconPath, iconEl);
        });
    }
}
function newShowRepoTreeIconsSidebar(fileElem) {
    const fileName = fileElem.textContent.trim().toLowerCase();
    const folderName = fileName.split('/').shift();
    let iconPath;
    const svgs = [...fileElem.querySelectorAll('svg')].filter((svg) => !isNavSidebarSvgShouldBeIgnored(svg));
    const svgFileElem = svgs[0];
    if (!svgFileElem)
        return;
    const { classList } = svgFileElem;
    if (classList.contains('octicon-file')) {
        iconPath = (0, Dev_1.getFileIcon)(fileName);
    }
    else if (classList.contains('octicon-file-directory-fill')) {
        iconPath = (0, Dev_1.getFolderIcon)(folderName);
    }
    else if (classList.contains('octicon-file-directory-open-fill')) {
        iconPath = (0, Icons_1.getIconForOpenFolder)(folderName);
    }
    else {
        // Unknown sidebar icon types are intentionally ignored.
    }
    if (!iconPath)
        return;
    fastdom.mutate(() => {
        const iconEl = svgFileElem;
        iconEl.style.display = 'none';
        // sometimes it just happens that the icon is not in the DOM anymore somehow
        if (!iconEl.parentElement)
            return;
        // cleanup previously added icons
        for (const child of iconEl.parentElement.children) {
            if (child.classList.contains('vscode-icon')) {
                child.remove();
            }
        }
        const imgNode = getHtmlIcon(iconPath, iconEl);
        iconEl.insertAdjacentHTML('afterend', imgNode);
    });
}
function update() {
    showIconsForSegments();
    if ((0, github_url_detection_1.isCommit)()) {
        // showDiffIcon();
    }
}
// const debugRemovedNodes = (root) => {
//   const observer = new MutationObserver((mutationsList) => {
//     for (const mutation of mutationsList) {
//       mutation.removedNodes.forEach((removedNode) => {
//         // if (removedNode === nodeToWatch) {
//           console.log('The node has been removed from the DOM!', removedNode);
//           observer.disconnect();
//         // }
//       });
//     }
//   });
//   observer.observe(root, {
//     childList: true,
//     subtree: true,
//   });
// }
function initGithub() {
    // Update on fragment update
    (0, selector_observer_1.observe)(exports.QUERY_FILE_TABLE_ITEMS, {
        add(rowEl) {
            // query selector that have large-screen in class name
            showRepoTreeIcons(rowEl);
        },
    });
    const QUERY_NEW_FILE_TABLE_ITEMS = 'react-app div[tabindex="0"] tbody tr';
    (0, selector_observer_1.observe)(QUERY_NEW_FILE_TABLE_ITEMS, {
        add(row) {
            newShowRepoTreeIcons(row);
        },
    });
    const FILE_SIDE_NAVIGATION_ITEMS_SVG = 'nav[aria-label="File Tree Navigation"] li svg';
    (0, selector_observer_1.observe)(FILE_SIDE_NAVIGATION_ITEMS_SVG, {
        // svg file icon update (opened / closed) or add
        add(elem) {
            const svg = elem;
            if (isNavSidebarSvgShouldBeIgnored(svg))
                return;
            const li = svg.closest('li');
            let fileElem = li.children[0];
            // pull request changed files file tree pattern
            if (li.children[0].tagName.toLowerCase() === 'span' && li.children[1].tagName.toLowerCase() === 'a') {
                fileElem = li.children[1];
            }
            newShowRepoTreeIconsSidebar(fileElem);
        },
    });
    const FILE_COMMAND_PALLETE_ITEMS = 'command-palette-item-group [aria-label="Files results"] command-palette-item';
    (0, selector_observer_1.observe)(FILE_COMMAND_PALLETE_ITEMS, {
        add(row) {
            newShowRepoTreeIconsCommandPallete(row);
        },
    });
    const FILE_SEARCH_RESULT_ITEMS = 'span[id^=file-result-]';
    (0, selector_observer_1.observe)(FILE_SEARCH_RESULT_ITEMS, {
        add(row) {
            newShowRepoTreeIconsFileSearchResult(row);
        },
    });
    const FILE_SEARCH_RESULT_GLOBAL_SEARCH = 'li[id^=query-builder] > a';
    (0, selector_observer_1.observe)(FILE_SEARCH_RESULT_GLOBAL_SEARCH, {
        add(row) {
            globalSearchResult(row);
        },
    });
    update();
    document.addEventListener('pjax:end', update); // Update on page change
}
exports.initGithub = initGithub;
