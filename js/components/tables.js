// Table functionalities
document.addEventListener('DOMContentLoaded', function() {
    // Initialize table sorting functionality
    initTableSort();
});

// Table sorting functionality
function initTableSort() {
    const tables = document.querySelectorAll('.sortable-table');
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('th.sortable');
        
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const index = Array.from(this.parentNode.children).indexOf(this);
                const isAsc = this.classList.contains('asc');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                
                // Clear all headers
                headers.forEach(h => {
                    h.classList.remove('asc', 'desc');
                    const icon = h.querySelector('.sort-icon');
                    if (icon) icon.textContent = '';
                });
                
                // Set current header
                this.classList.add(isAsc ? 'desc' : 'asc');
                const sortIcon = this.querySelector('.sort-icon');
                if (sortIcon) {
                    sortIcon.textContent = isAsc ? '▼' : '▲';
                }
                
                // Sort the rows
                rows.sort((a, b) => {
                    const aValue = a.children[index].textContent.trim();
                    const bValue = b.children[index].textContent.trim();
                    
                    // Check if the values are numbers
                    const aNum = parseFloat(aValue);
                    const bNum = parseFloat(bValue);
                    
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return isAsc ? bNum - aNum : aNum - bNum;
                    }
                    
                    // Otherwise, compare as strings
                    return isAsc
                        ? bValue.localeCompare(aValue, 'vi')
                        : aValue.localeCompare(bValue, 'vi');
                });
                
                // Reappend rows in the new order
                rows.forEach(row => tbody.appendChild(row));
            });
        });
    });
} 