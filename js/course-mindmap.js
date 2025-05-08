'use strict';

// Simplified DOM Selector/Wrapper
const $ = function(selectorOrElement) {
    let nodes = [];
    if (selectorOrElement) {
        if (selectorOrElement.nodeType || selectorOrElement === window || selectorOrElement === document) {
            nodes = [selectorOrElement]; // Handle single node, window, document
        } else if (NodeList.prototype.isPrototypeOf(selectorOrElement)) {
            nodes = selectorOrElement; // Handle NodeList
        } else if (typeof selectorOrElement === 'string') {
            try {
                nodes = document.querySelectorAll(selectorOrElement);
            } catch (e) {
                console.error("Invalid selector:", selectorOrElement, e);
                nodes = [];
            }
        } else {
             console.error("Invalid input to $ helper:", selectorOrElement);
             nodes = [];
        }
    }

    // Return an object with methods
    return {
        nodes: nodes,
        n: nodes[0], // First node convenience

        each: function(callback) {
            this.nodes.forEach(node => callback(node));
            return this;
        },
        addClass: function(classString) {
            const classes = classString.split(' ').map(c => c.trim()).filter(c => c);
            if (classes.length > 0) {
                 this.each(node => node.classList && node.classList.add(...classes));
            }
            return this;
        },
        html: function(newHtml) {
             if (typeof newHtml === 'undefined') {
                 return this.n ? this.n.innerHTML : undefined;
             }
            this.each(node => node.innerHTML = newHtml);
            return this;
        },
        create: function(tagName) {
            return $(document.createElement(tagName));
        },
        append: function(elementOrTagName) {
            let childNode;
            if (typeof elementOrTagName === 'string') {
                childNode = document.createElement(elementOrTagName);
            } else if (elementOrTagName && elementOrTagName.n) { // If it's a $ object
                childNode = elementOrTagName.n;
            } else if (elementOrTagName && elementOrTagName.nodeType) { // If it's a native node
                childNode = elementOrTagName;
            } else {
                 console.error("Cannot append invalid element:", elementOrTagName);
                 return this; 
            }
            
            if (this.n && childNode) {
                 this.n.appendChild(childNode);
            }
            return $(childNode); 
        },
        remove: function() {
            this.each(node => node.remove());
            return this; 
        },
        insertAfter: function(targetElementOrObject) {
            const targetNode = targetElementOrObject.n || targetElementOrObject; 
            if (this.n && targetNode && targetNode.parentNode) {
                 targetNode.parentNode.insertBefore(this.n, targetNode.nextSibling);
            }
            return this;
        },
        setAttr: function(attrName, value = "") {
            this.each(node => node.setAttribute(attrName, value));
            return this;
        },
        // Chainable attribute setters
        id: function(idVal) { return this.setAttr("id", idVal); },
        d: function(dVal) { return this.setAttr("d", dVal); },
        fill: function(fillVal) { return this.setAttr("fill", fillVal); },
        stroke: function(strokeVal) { return this.setAttr("stroke", strokeVal); },
        strokeWidth: function(widthVal) { return this.setAttr("stroke-width", widthVal); },
         // Method to append specifically for SVG elements within the chain
        sAppend: function(svgChildObject) {
             if (this.n && svgChildObject.n && this.n instanceof SVGElement && svgChildObject.n instanceof SVGElement) {
                  this.n.appendChild(svgChildObject.n);
             }
            return this;
        }
    };
};

// Standalone SVG Creation Helpers
const createSVGElement = (tagName) => document.createElementNS("http://www.w3.org/2000/svg", tagName);

const createSVGContainer = (viewBox) => {
    const svg = createSVGElement("svg");
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("viewBox", viewBox);
    return $(svg); // Return wrapped SVG
};

const createBezierPath = (x1, y1, x2, y2) => {
    const path = createSVGElement("path");
    const dVal = `M${x1},${y1} C ${(x1+x2)/2},${y1} ${(x1+x2)/2},${y2} ${x2},${y2}`;
    path.setAttribute("d", dVal);
    return $(path); // Return wrapped path
};

// --- End Refactored Helper Functions ---

const resizeObserver = new ResizeObserver(entries => {
    // Use the new selector syntax
    const existingSVG = $('#mySVG');
    if (existingSVG.n) { 
        existingSVG.remove();
    }
    // Check container before drawing
    if ($('#container').n && $('#container').n.getBoundingClientRect().width > 0) {
        drawLines(courseData); 
    }
});

function createMap(data) {
    //find depth of Elements
    function findDepth(id, depth = 0) {
        while (id !== null) {
            let aktEl = data.filter(x => x.id == id);
            if (aktEl.length === 0) { // Prevent error if parent not found
                console.warn("Parent with id:", id, "not found during findDepth");
                return depth; // or some default depth or error handling
            }
            depth++;
            id = aktEl[0].parentId;
            if (id == null) { // This is a first-level child (parent is the root)
                if (aktEl[0].div === undefined) { // Check if div is defined for root's children
                    console.warn("Element", aktEl[0].id, "is a child of root but has no .div property");
                } else {
                    depth = depth * aktEl[0].div;
                }
            }
        }
        return depth;
    }

    var aktDiv = -1; // first div at left side (-1*-1=1)
    // Assign .div for first-level children (parentId: null, but not the root itself)
    data.filter(x => x.parentId === null && x.id !== null)
        .forEach(x => {
            x.div = aktDiv;
            aktDiv *= -1;
        });

    const rootNode = data.find(x => x.id === null);
    if (rootNode) {
        rootNode.div = 0; // set root Elements div = 0
    } else {
        console.error("Root node (id: null) not found in data!");
        return; // Cannot proceed without root
    }

    // set divs for Childs of children (grandchildren of root, etc.)
    data.filter(x => (x.parentId !== null && x.id !== null))
        .forEach(x => {
            const parentElement = data.find(p => p.id === x.parentId);
            if (parentElement && parentElement.id !== null) { // Ensure parent is not the absolute root
                x.div = findDepth(x.id); // Recalculate depth based on parent's .div
            } else if (parentElement && parentElement.id === null) {
                // This means x is a direct child of the root, its .div is already set above.
            }
        });

    // find min and max Div-Number
    let minDiv = Math.min(...data.map(item => item.div).filter(d => typeof d === 'number'));
    let maxDiv = Math.max(...data.map(item => item.div).filter(d => typeof d === 'number'));

    if (!isFinite(minDiv) || !isFinite(maxDiv)) {
        console.error("Could not determine min/max div numbers. Check .div assignments.", data.map(item => item.div));
        minDiv = 0; // Fallback
        maxDiv = 0; // Fallback
    }

    const container = $('#container');
    if (!container.n) {
        console.error("Mindmap container #container not found in DOM.");
        return;
    }
    container.html(''); // Clear previous content

    for (let i = minDiv; i <= maxDiv; i++) {
        container.append('div').id(`div${i}`).addClass('f-col');
    }

    data.forEach(el => {
        if (el.div !== undefined && $(`#div${el.div}`).n) {
            const pElement = $(`#div${el.div}`).append('p').id(`p${el.id === null ? 'null' : el.id}`);

            // Create visual element (icon or image)
            if (el.imageSrc || el.iconClass) {
                const visualDiv = pElement.append('div').addClass('node-visual');
                if (el.imageSrc) {
                    visualDiv.append('img').setAttr('src', el.imageSrc).setAttr('alt', el.text.replace(/<br>/g, ' '));
                } else if (el.iconClass) {
                    const iconElement = visualDiv.append('i');
                    // FIX: Split space-separated classes and add them correctly
                    const classesToAdd = el.iconClass.split(' ').filter(cls => cls.length > 0); // Filter out empty strings
                    if (iconElement.n && iconElement.n.classList) { // Ensure element and classList exist
                        iconElement.n.classList.add(...classesToAdd); // Use spread operator
                    }
                }
            }

            // Create title (link or plain text)
            const titleContainer = pElement.append('span').addClass('node-title-container');
            if (el.href) {
                const link = titleContainer.append('a');
                link.setAttr('href', el.href);
                link.html(el.text);
            } else {
                titleContainer.html(el.text);
            }

            // Create description
            if (el.description) {
                pElement.append('span').addClass('node-description').html(el.description);
            }

            if (el.id === null) {
                pElement.addClass('mindmap-root-node');
            }
        } else {
            console.warn("Element", el.id, "has no .div or target div not found.", el.div);
        }
    });
}

function drawLines(data) {
    const containerElement = $('#container').n;
    if (!containerElement) {
        console.error("drawLines: Container #container not found.");
        return;
    }
    
    const existingSVG = $('#mySVG');
    if (existingSVG.n) { 
        existingSVG.remove();
    }

    let mC = containerElement.getBoundingClientRect();
    let svgWidth = Math.max(mC.width, containerElement.scrollWidth);
    let svgHeight = Math.max(mC.height, containerElement.scrollHeight);
    // console.log(`drawLines: Container bounds: ${mC.width}x${mC.height}, Scroll: ${containerElement.scrollWidth}x${containerElement.scrollHeight}, SVG Size: ${svgWidth}x${svgHeight}`);

    if (svgWidth <= 0 || svgHeight <= 0) { 
        console.warn("drawLines: Container/Scroll size is zero or invalid.");
        return; 
    }

    // FIX: Use the standalone helper function, not the $ wrapper method
    const svgWrapper = createSVGContainer(`0 0 ${svgWidth} ${svgHeight}`).id('mySVG'); 
    
    if (containerElement.firstChild) {
        containerElement.insertBefore(svgWrapper.n, containerElement.firstChild);
    } else {
        containerElement.appendChild(svgWrapper.n);
    }
    // console.log("drawLines: SVG element created and prepended.");
    
    svgWrapper.setAttr('width', `${svgWidth}px`);
    svgWrapper.setAttr('height', `${svgHeight}px`);
    svgWrapper.n.style.position = 'absolute'; 
    svgWrapper.n.style.top = '0';
    svgWrapper.n.style.left = '0';
    svgWrapper.n.style.pointerEvents = 'none'; 

    data.forEach(el => {
        if (el.parentId !== undefined) { 
            const aktElNode = $(`#p${el.id === null ? 'null' : el.id}`);
            const parElNode = $(`#p${el.parentId === null ? 'null' : el.parentId}`);

            if (aktElNode.n && parElNode.n) { 
                let aktRect = aktElNode.n.getBoundingClientRect();
                let parRect = parElNode.n.getBoundingClientRect();
                let containerRect = containerElement.getBoundingClientRect();
                let scrollLeft = containerElement.scrollLeft;
                let scrollTop = containerElement.scrollTop;

                if (aktRect.width === 0 || parRect.width === 0) {
                    console.warn(`drawLines: Skipping line for ${el.id} - zero width node.`);
                    return; 
                }

                let aktXRel = (aktRect.left < parRect.left) ? aktRect.left + aktRect.width - containerRect.left + scrollLeft : aktRect.left - containerRect.left + scrollLeft;
                let aktYRel = aktRect.top - containerRect.top + scrollTop + (aktRect.height / 2);
                let parXRel = (aktRect.left > parRect.left) ? parRect.left + parRect.width - containerRect.left + scrollLeft : parRect.left - containerRect.left + scrollLeft;
                let parYRel = parRect.top - containerRect.top + scrollTop + (parRect.height / 2);

                // console.log(`drawLines: Coords for ${el.id}: M(${aktXRel}, ${aktYRel}) P(${parXRel}, ${parYRel})`); 

                if (![aktXRel, aktYRel, parXRel, parYRel].every(coord => Number.isFinite(coord))) {
                    console.warn(`drawLines: Skipping line for ${el.id} due to invalid coords.`);
                    return; 
                }

                // Use new helper to create path
                const path = createBezierPath(aktXRel, aktYRel, parXRel, parYRel);
                path.addClass('path'); 
                svgWrapper.sAppend(path); // Append path to SVG using new helper method
            } else {
                console.warn(`drawLines: Could not find elements for line: p${el.id === null ? 'null' : el.id} or p${el.parentId === null ? 'null' : el.parentId}`);
            }
        }
    });
    // console.log("drawLines function finished.");
}

const courseData = [
    {
        id: null, text: "<b>Tất cả<br>Khóa học</b>",
        href: "/tat-ca-khoa-hoc",
        iconClass: 'bi bi-collection-play-fill', description: "Khám phá toàn bộ lộ trình học tập."
    },
    {
        id: 'course1', parentId: null, text: "Lập trình Web<br>Cơ bản",
        href: "/khoa-hoc/lap-trinh-web-co-ban",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },
    {
        id: 'course2', parentId: null, text: "Phân tích<br>Dữ liệu",
        href: "/khoa-hoc/phan-tich-du-lieu",
        iconClass: 'bi bi-bar-chart-line-fill', description: "Khai phá thông tin từ dữ liệu lớn."
    },
    {
        id: 'course3', parentId: null, text: "Thiết kế<br>UI/UX",
        href: "/khoa-hoc/thiet-ke-ui-ux",
        iconClass: 'bi bi-palette-fill', description: "Tạo giao diện người dùng đẹp và hiệu quả."
    },
    {
        id: 'course4', parentId: null, text: "Tài chính<br>Ngân hàng Số",
        href: "/khoa-hoc/tai-chinh-ngan-hang-so",
        iconClass: 'bi bi-bank', description: "Công nghệ và xu hướng trong tài chính số."
    },
    // Example of a sub-node course1_1:
    {
        id: 'course1_1', parentId: 'course1', text: "HTML & CSS<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/html-css-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },
    {
        id: 'course1_2', parentId: 'course1', text: "JavaScript<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/javascript-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },
    {
        id: 'course1_3', parentId: 'course1', text: "React<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/react-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },
    // Example of a sub-node course_2:
    {
        id: 'course2_1', parentId: 'course2', text: "HTML & CSS<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/html-css-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },
    {
        id: 'course2_2', parentId: 'course2', text: "JavaScript<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/javascript-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },
    {
        id: 'course2_3', parentId: 'course2', text: "React<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/react-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },

    // Example of a sub-node course_3: 
    {
        id: 'course3_1', parentId: 'course3', text: "HTML & CSS<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/html-css-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },
    {
        id: 'course3_2', parentId: 'course3', text: "JavaScript<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/javascript-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },
    {
        id: 'course3_3', parentId: 'course3', text: "React<br>Fundamentals",
        href: "/khoa-hoc/lap-trinh-web-co-ban/react-fundamentals",
        iconClass: 'bi bi-code-slash', description: "Nền tảng cho người mới bắt đầu với web."
    },
];

// Initial setup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = $('#container');
    if (!container.n) {
        console.error("Mindmap container #container not found.");
        return;
    }
    createMap(courseData);
    
    requestAnimationFrame(() => {
        drawLines(courseData);
    });
        
    if (container.n) {
        resizeObserver.observe(container.n);
    }
}); 