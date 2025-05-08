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

let mindmapInstanceData = null;
let mindmapContainerSelector = ''; // Store the selector string
let mindmapContainerElementForObserver = null; // Store the actual element for the observer

const resizeObserver = new ResizeObserver(entries => {
    const existingSVG = $('#mySVG');
    if (existingSVG.n) { 
        existingSVG.remove();
    }
    // Check container before drawing
    if (mindmapContainerElementForObserver && mindmapContainerElementForObserver.getBoundingClientRect().width > 0 && mindmapInstanceData) {
        drawLines(mindmapInstanceData, mindmapContainerSelector); 
    }
});

function createMap(data, currentContainerSelector) {
    //find depth of Elements
    function findDepth(id, depth = 0) {
        while (id !== null) {
            let aktEl = data.filter(x => x.id == id);
            if (aktEl.length === 0) { 
                // console.warn("Parent with id:", id, "not found during findDepth"); // Keep console.warn for debugging data issues
                return depth; 
            }
            // If parent is collapsed, children's depth calculation might need adjustment or they are simply not rendered.
            // For now, depth calculation remains, but rendering will be skipped.
            depth++;
            id = aktEl[0].parentId;
            if (id == null) { 
                if (aktEl[0].div === undefined) { 
                    // console.warn("Element", aktEl[0].id, "is a child of root but has no .div property");
                } else {
                    depth = depth * aktEl[0].div;
                }
            }
        }
        return depth;
    }

    var aktDiv = -1; 
    data.filter(x => x.parentId === null && x.id !== null)
        .forEach(x => {
            x.div = aktDiv;
            aktDiv *= -1;
        });

    const rootNode = data.find(x => x.id === null);
    if (rootNode) {
        rootNode.div = 0; 
    } else {
        console.error("Root node (id: null) not found in data!");
        return; 
    }

    data.filter(x => (x.parentId !== null && x.id !== null))
        .forEach(x => {
            // Check if any ancestor is collapsed. If so, this node won't be visible,
            // and its .div assignment might not be strictly necessary or could be misleading
            // if it were used for layout calculations of visible elements.
            let isOrphanedByCollapse = false;
            if (x.parentId !== null && x.parentId !== undefined) {
                const parentNode = data.find(p => p.id === x.parentId);
                if (parentNode && isNodeOrAncestorCollapsed(parentNode, data)) {
                    isOrphanedByCollapse = true;
                }
            }

            if (!isOrphanedByCollapse) {
                const parentElement = data.find(p => p.id === x.parentId);
                if (parentElement && parentElement.id !== null) { 
                    x.div = findDepth(x.id); 
                } else if (parentElement && parentElement.id === null) {
                    // This means x is a direct child of the root, its .div is already set above.
                }
            } else {
                // Optionally, explicitly mark .div as undefined or skip if it's orphaned,
                // though the rendering logic should handle not displaying it.
                // x.div = undefined; // Or handle as needed.
            }
        });
    
    let divsToCreate = data
        .filter(el => {
            if (el.parentId !== null && el.parentId !== undefined) {
                const parentNode = data.find(p => p.id === el.parentId);
                // If the parent (or any ancestor) is collapsed, this 'el' won't be rendered,
                // so its .div shouldn't contribute to column creation.
                if (parentNode && isNodeOrAncestorCollapsed(parentNode, data)) {
                    return false; 
                }
            }
            return true; // Include if root, top-level, or child of a non-collapsed pathway
        })
        .map(item => item.div)
        .filter(d => typeof d === 'number');

    let minDiv = Math.min(...divsToCreate, 0); 
    let maxDiv = Math.max(...divsToCreate, 0);


    if (!isFinite(minDiv) || !isFinite(maxDiv)) {
        // This might happen if all nodes are children of collapsed nodes except the root
        if (divsToCreate.length === 0 && rootNode) {
            minDiv = rootNode.div;
            maxDiv = rootNode.div;
        } else {
            console.error("Could not determine min/max div numbers. Check .div assignments.", data.map(item => item.div));
            minDiv = 0; 
            maxDiv = 0; 
        }
    }

    const container = $(currentContainerSelector);
    if (!container.n) {
        console.error("Mindmap container " + currentContainerSelector + " not found in DOM.");
        return;
    }
    container.html(''); 

    for (let i = minDiv; i <= maxDiv; i++) {
        container.append('div').id(`div${i}`).addClass('f-col');
    }

    data.forEach(el => {
        // Determine if the current element 'el' should be rendered.
        // It should NOT be rendered if it has a parent AND that parent (or any ancestor of that parent) is collapsed.
        if (el.parentId !== null && el.parentId !== undefined) {
            const parentNode = data.find(p => p.id === el.parentId);
            if (parentNode && isNodeOrAncestorCollapsed(parentNode, data)) {
                return; // Do not render this child element.
            }
        }

        // If we reach here, 'el' itself is either:
        // 1. The root node.
        // 2. A top-level node (parentId is null but id is not null).
        // 3. A child node whose parent (and ancestors) are NOT collapsed.
        // So, we should proceed to render 'el'.

        // Ensure the target div for this element exists (it might not if all its children were collapsed, leading to fewer columns)
        const targetDivExists = $(`#div${el.div}`).n;

        if (el.div !== undefined && targetDivExists) {
            const pElement = $(`#div${el.div}`).append('p').id(`p${el.id === null ? 'null' : el.id}`);
            
            const children = data.filter(child => child.parentId === el.id);
            // Only add toggle button if the node has children AND it is not the root node (el.id !== null)
            if (children.length > 0 && el.id !== null) { 
                const toggleBtn = pElement.append('span').addClass('mindmap-toggle');
                toggleBtn.html(el.collapsed ? '[+]' : '[-]');
                if (toggleBtn.n) { 
                    toggleBtn.n.addEventListener('click', (event) => {
                        event.stopPropagation();
                        // Operate on the globally stored mindmapInstanceData
                        const nodeData = mindmapInstanceData.find(n => n.id === el.id);
                        if (nodeData) {
                            nodeData.collapsed = !nodeData.collapsed;
                        }
                        // Use the globally stored selector for redrawing
                        createMap(mindmapInstanceData, mindmapContainerSelector); 
                        requestAnimationFrame(() => drawLines(mindmapInstanceData, mindmapContainerSelector));
                    });
                }
            }


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

function drawLines(data, currentContainerSelector) {
    const containerElement = $(currentContainerSelector).n;
    if (!containerElement) {
        console.error("drawLines: Container " + currentContainerSelector + " not found.");
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
            // Check if element or its parent should be drawn based on collapsed state
            const elNodeData = data.find(item => item.id === el.id);
            const parentNodeData = data.find(item => item.id === el.parentId);

            if (elNodeData && parentNodeData && isNodeOrAncestorCollapsed(parentNodeData, data)) {
                // If parent is collapsed, don't draw line to this child
                return;
            }
            
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

// Helper function to check if a node or any of its ancestors are collapsed
function isNodeOrAncestorCollapsed(node, allData) {
    if (!node) return false;
    if (node.collapsed) return true;
    if (node.parentId === undefined || node.parentId === null) return false; // Reached root or a top-level node

    let parent = allData.find(p => p.id === node.parentId);
    while (parent) {
        if (parent.collapsed) return true;
        if (parent.parentId === undefined || parent.parentId === null) break;
        parent = allData.find(p => p.id === parent.parentId);
    }
    return false;
}

// Initial setup when DOM is ready - This will be replaced by initMindmap
// document.addEventListener('DOMContentLoaded', () => { ... });


function initMindmap(containerSelector, initialData) {
    // Ensure all nodes have 'collapsed' property, defaulting to false
    mindmapInstanceData = initialData.map(node => ({ 
        ...node, 
        collapsed: node.collapsed === undefined ? false : node.collapsed 
    }));
    mindmapContainerSelector = containerSelector;
    
    const container = $(containerSelector);
    mindmapContainerElementForObserver = container.n; // Store the actual DOM element

    if (!mindmapContainerElementForObserver) {
        console.error("Mindmap container " + containerSelector + " not found for initialization.");
        return;
    }

    createMap(mindmapInstanceData, mindmapContainerSelector);
    
    requestAnimationFrame(() => {
        drawLines(mindmapInstanceData, mindmapContainerSelector);
    });
        
    if (mindmapContainerElementForObserver) {
        // Disconnect observer from any previous element before observing a new one
        resizeObserver.disconnect(); 
        resizeObserver.observe(mindmapContainerElementForObserver);
    }
}

// To make initMindmap globally accessible if not using ES6 modules:
// window.initMindmap = initMindmap; 
// Or, if you plan to use this as an ES6 module, you would:
// export { initMindmap }; 