// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    // Select all checkboxes functionality
    const selectAllCheckbox = document.getElementById("select-all");
    const taskCheckboxes = document.querySelectorAll(".task-checkbox");
    
    // Function to update the select all checkbox state
    function updateSelectAllState() {
        const checkedCount = Array.from(taskCheckboxes).filter(cb => cb.checked).length;
        const totalCount = taskCheckboxes.length;
        
        if (checkedCount === 0) {
            // No checkboxes selected
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === totalCount) {
            // All checkboxes selected
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            // Some checkboxes selected (indeterminate state)
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }
    
    if (selectAllCheckbox) {
        // Handle select all checkbox click
        selectAllCheckbox.addEventListener("change", function() {
            // If indeterminate, clear it and check all
            if (this.indeterminate) {
                this.indeterminate = false;
                this.checked = true;
            }
            
            taskCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            
            updateSelectAllState();
        });
    }
    
    // Add event listeners to individual task checkboxes
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            updateSelectAllState();
        });
    });
    
    // Initialize the select all state on page load
    updateSelectAllState();

    // Function to refresh checkbox states (useful for dynamic content)
    function refreshCheckboxStates() {
        const newTaskCheckboxes = document.querySelectorAll(".task-checkbox");
        newTaskCheckboxes.forEach(checkbox => {
            if (!checkbox.hasAttribute('data-listener-added')) {
                checkbox.addEventListener("change", function() {
                    updateSelectAllState();
                });
                checkbox.setAttribute('data-listener-added', 'true');
            }
        });
        updateSelectAllState();
    }

    // Modal functionality
    const addUpdateModal = document.getElementById("AddUpdate");
    const addTaskBtn = document.getElementById("add-task-btn");
    const closeModal = document.getElementById("close");
    const taskForm = document.getElementById("task-form");
    const addButton = document.getElementById("add-task");
    const updateButton = document.getElementById("update-task");
    let currentTaskId = null;

    // Open modal for adding new task
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", function() {
            currentTaskId = null;
            taskForm.reset();
            document.getElementById('task-id').value = '';
            addButton.style.display = "inline-block";
            updateButton.style.display = "none";
            addUpdateModal.style.display = "flex";
        });
    }

    // Open modal for editing task
    document.querySelectorAll(".task-row").forEach(row => {
        row.addEventListener("dblclick", function() {
            currentTaskId = this.getAttribute('data-task-id');
            document.getElementById('task-id').value = currentTaskId;
            populateFormForEdit(this);
            addButton.style.display = "none";
            updateButton.style.display = "inline-block";
            addUpdateModal.style.display = "flex";
        });
    });

    // Close modal
    if (closeModal) {
        closeModal.addEventListener("click", function() {
            addUpdateModal.style.display = "none";
        });
    }

    // Close modal on outside click
    window.addEventListener("click", function(event) {
        if (event.target === addUpdateModal) {
            addUpdateModal.style.display = "none";
        }
    });

    // Populate form for editing
    function populateFormForEdit(row) {
        const cells = row.querySelectorAll('td');
        document.getElementById('task').value = cells[1].textContent.trim();
        
        // Get dates from data attributes (in mm/dd/yyyy format) and convert to yyyy-mm-dd
        const entryDate = cells[2].getAttribute('data-date');
        const startDate = cells[3].getAttribute('data-date');
        const endDate = cells[4].getAttribute('data-date');
        
        document.getElementById('entry').value = formatDateForInput(entryDate);
        document.getElementById('start').value = formatDateForInput(startDate);
        document.getElementById('end').value = formatDateForInput(endDate);
        
        document.getElementById('desc').value = cells[5].textContent.trim();
        document.getElementById('owner').value = cells[6].textContent.trim();
        document.getElementById('type').value = cells[7].textContent.trim();
        document.getElementById('status').value = cells[8].textContent.trim();
    }

    // Function to format date for HTML date input
    // Converts mm/dd/yyyy to yyyy-mm-dd
    function formatDateForInput(dateString) {
        if (!dateString || dateString.trim() === '') return '';
        
        try {
            // Clean up the date string
            let cleanDateString = dateString.trim();
            
            // If it's already in YYYY-MM-DD format, return as is
            if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDateString)) {
                return cleanDateString;
            }
            
            // Check if it's in MM/DD/YYYY format
            const mmddyyyyMatch = cleanDateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (mmddyyyyMatch) {
                const [, month, day, year] = mmddyyyyMatch;
                const formattedMonth = month.padStart(2, '0');
                const formattedDay = day.padStart(2, '0');
                return `${year}-${formattedMonth}-${formattedDay}`;
            }
            
            // Try to parse as a regular date string
            const date = new Date(cleanDateString);
            
            // Check if the date is valid
            if (isNaN(date.getTime())) {
                console.warn('Invalid date:', dateString);
                return '';
            }
            
            // Format as YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Error formatting date:', dateString, error);
            return '';
        }
    }

    // Handle form submission
    if (addButton) {
        addButton.addEventListener("click", function(e) {
            e.preventDefault();
            taskForm.submit();
        });
    }

    if (updateButton) {
        updateButton.addEventListener("click", function(e) {
            e.preventDefault();
            if (currentTaskId) {
                taskForm.action = `/dashboard/update/${currentTaskId}/`;
                taskForm.submit();
            }
        });
    }

    // Delete selected tasks
    const deleteBtn = document.getElementById("delete");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", function() {
            const selectedTasks = Array.from(taskCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.getAttribute('data-task-id'));
            
            if (selectedTasks.length > 0) {
                showConfirmModal("Are you sure you want to delete selected tasks?", function() {
                    deleteSelectedTasks(selectedTasks);
                });
            } else {
                showResponse("No tasks selected for deletion");
            }
        });
    }

    // Clear all tasks
    const clearBtn = document.getElementById("clear");
    if (clearBtn) {
        clearBtn.addEventListener("click", function() {
            showConfirmModal("Are you sure you want to clear all tasks?", function() {
                clearAllTasks();
            });
        });
    }

    // Refresh page
    const refreshBtn = document.getElementById("refresh");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", function() {
            location.reload();
        });
    }

    // Delete selected tasks function
    function deleteSelectedTasks(taskIds) {
        fetch('/dashboard/delete-selected/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ task_ids: taskIds })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                showResponse("Error deleting tasks");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showResponse("Error deleting tasks");
        });
    }

    // Clear all tasks function
    function clearAllTasks() {
        fetch('/dashboard/clear-all/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                showResponse("Error clearing tasks");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showResponse("Error clearing tasks");
        });
    }

    // Confirmation modal
    function showConfirmModal(message, onConfirm) {
        const confirmModal = document.getElementById("confirmModal");
        const confirmText = document.getElementById("confirmText");
        const confirmYes = document.getElementById("confirmYes");
        const confirmNo = document.getElementById("confirmNo");
        
        confirmText.textContent = message;
        confirmModal.style.display = "flex";
        
        confirmYes.onclick = function() {
            confirmModal.style.display = "none";
            onConfirm();
        };
        
        confirmNo.onclick = function() {
            confirmModal.style.display = "none";
        };
    }

    // Show response message
    function showResponse(message) {
        const showResponse = document.getElementById("show-response");
        const showResponseMessage = document.getElementById("show-response-message");
        
        showResponseMessage.textContent = message;
        showResponse.style.display = "flex";
        
        setTimeout(() => {
            showResponse.style.display = "none";
        }, 3000);
    }

    // Navigation functionality
    const task_management = document.getElementById("task-management");
    const dashboard = document.getElementById("dashboard");
    const statistic = document.getElementById("statistic");
    const info = document.getElementById("info");
    const setting = document.getElementById("setting");
    const logout = document.getElementById("logout");

    if (statistic) {
        statistic.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "/dashboard/statistics/";
        });
    }
    if (info) {
        info.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "/info/";
        });
    }
    if (setting) {
        setting.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "/setting/";
        });
    }
    if (task_management) {
        task_management.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "/taskManager/";
        });
    }
    if (dashboard) {
        dashboard.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "/dashboard/";
        });
    }
    if (logout) {
        logout.addEventListener("click", (event) => {
            event.preventDefault();
            
            // Show confirmation dialog
            showConfirmModal("Are you sure you want to logout?", function() {
                // Show logout process
                showResponse("Logging out...");
                
                // Redirect to logout URL after a brief delay
                setTimeout(() => {
                    window.location.href = "/logout/";
                }, 1000);
            });
        });
    }

    // Show "Link Copied" message for social links
    const show_response = document.getElementById("show-response");
    document.querySelectorAll(".share-socail").forEach((shared) => {
        shared.addEventListener("click", (event) => {
            const show_response_message = document.getElementById("show-response-message");
            show_response_message.textContent = "Link Copied";
            event.preventDefault();
            show_response.style.display = "flex";
            setTimeout(() => {
                show_response.style.display = "none";
            }, 3000);
        });
    });
});
