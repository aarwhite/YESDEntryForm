/**
 * CONFIGURATION
 * Replace the URL below with your deployed Google Apps Script Web App URL.
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxej24vaQfaG7p5ZqeqGzjaO9IkOkp_BZAccry_TyRduAEwqSFu-UNUwO3Ee1PX9PFc/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('entryForm');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const teamMembersList = document.getElementById('teamMembersList');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    // Add Team Member
    addMemberBtn.addEventListener('click', () => {
        const memberCount = teamMembersList.children.length + 1;
        const div = document.createElement('div');
        div.className = 'team-member-row';
        div.innerHTML = `
            <input type="text" name="teamMember[]" placeholder="Team Member ${memberCount} Name" required>
            <button type="button" class="remove-btn" aria-label="Remove member">&times;</button>
        `;
        teamMembersList.appendChild(div);

        // Focus on the new input
        div.querySelector('input').focus();
    });

    // Remove Team Member
    teamMembersList.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) {
            const row = e.target.closest('.team-member-row');
            // Don't remove if it's the only one (optional rule, but good UX)
            if (teamMembersList.children.length > 1) {
                row.remove();
                updatePlaceholders();
            } else {
                alert('You must have at least one team member.');
            }
        }
    });

    function updatePlaceholders() {
        const inputs = teamMembersList.querySelectorAll('input[name="teamMember[]"]');
        inputs.forEach((input, index) => {
            input.placeholder = `Team Member ${index + 1} Name`;
        });
    }

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE' || !GOOGLE_SCRIPT_URL) {
            showMessage('Error: Google Script URL is not configured. Please see the setup guide.', 'error');
            return;
        }

        setLoading(true);

        // Collect data
        const formData = new FormData(form);
        const teamMembers = formData.getAll('teamMember[]');

        const data = {
            schoolName: formData.get('schoolName'),
            contactName: formData.get('contactName'),
            contactNumber: formData.get('contactNumber'),
            ageGroup: formData.get('ageGroup'),
            teamMembers: teamMembers.join(', '), // Join names with comma
            timestamp: new Date().toISOString()
        };

        try {
            // We use 'no-cors' mode for simple submission if we don't need to read the response,
            // BUT Google Apps Script can return JSONP or CORS headers.
            // Standard fetch with CORS is best if the script handles OPTIONS/CORS correctly.
            // For simplicity with Apps Script, we often use text/plain payload to avoid preflight OPTIONS check issues 
            // or ensure the script returns correct headers.

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data)
                // Intentionally not setting Content-Type to application/json to avoid preflight in some cases,
                // but standard Apps Script handling usually requires text/plain or handling the preflight.
                // We will use text/plain in the Apps Script to be safe.
            });

            if (response.ok) {
                showMessage('Success! Your entry has been submitted.', 'success');
                form.reset();
                // Reset team members to just one
                teamMembersList.innerHTML = `
                    <div class="team-member-row">
                        <input type="text" name="teamMember[]" placeholder="Team Member 1 Name" required>
                    </div>
                `;
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Submitting...' : 'Submit Entry';
    }

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `message ${type}`;
        formMessage.classList.remove('hidden');

        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        }
    }
});
