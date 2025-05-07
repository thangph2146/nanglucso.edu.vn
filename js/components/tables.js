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
            // Initialize ARIA sort attribute and default icon
            header.setAttribute('aria-sort', 'none');
            const initialIconContainer = header.querySelector('.sort-icon');
            if (initialIconContainer && !initialIconContainer.innerHTML.trim()) {
                initialIconContainer.innerHTML = '<i class="bi bi-arrow-down-up"></i>';
            }
            header.addEventListener('click', function() {
                const index = Array.from(this.parentNode.children).indexOf(this);
                const isAsc = this.classList.contains('asc');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                
                // Clear all headers' sort states and icons
                headers.forEach(h => {
                    if (h !== this) {
                        h.classList.remove('asc', 'desc');
                        h.setAttribute('aria-sort', 'none');
                        const icon = h.querySelector('.sort-icon');
                        if (icon) icon.innerHTML = '<i class="bi bi-arrow-down-up"></i>'; // Reset to default icon
                    }
                });
                
                // Set current header state and icon
                let newSortState;
                if (this.classList.contains('asc')) { // Was ascending, now descending
                    this.classList.remove('asc');
                    this.classList.add('desc');
                    newSortState = 'descending';
                } else if (this.classList.contains('desc')) { // Was descending, now ascending
                    this.classList.remove('desc');
                    this.classList.add('asc');
                    newSortState = 'ascending';
                } else { // Not sorted or sorted by another column, now ascending
                    this.classList.add('asc');
                    newSortState = 'ascending';
                }
                this.setAttribute('aria-sort', newSortState);

                const sortIconContainer = this.querySelector('.sort-icon');
                if (sortIconContainer) {
                    if (newSortState === 'ascending') {
                        sortIconContainer.innerHTML = '<i class="bi bi-sort-up-alt"></i>';
                    } else {
                        sortIconContainer.innerHTML = '<i class="bi bi-sort-down-alt"></i>';
                    }
                }

                const sortAsc = newSortState === 'ascending';
                
                // Sort the rows
                rows.sort((a, b) => {
                    const aValue = a.children[index].textContent.trim();
                    const bValue = b.children[index].textContent.trim();
                    
                    // Check if the values are numbers
                    const aNum = parseFloat(aValue);
                    const bNum = parseFloat(bValue);
                    
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return sortAsc ? aNum - bNum : bNum - aNum;
                    }
                    
                    // Otherwise, compare as strings
                    return sortAsc
                        ? aValue.localeCompare(bValue, 'vi')
                        : bValue.localeCompare(aValue, 'vi');
                });
                
                // Reappend rows in the new order
                rows.forEach(row => tbody.appendChild(row));
            });
        });
    });
}