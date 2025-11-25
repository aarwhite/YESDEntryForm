/**
 * CONFIGURATION
 * Replace the URL below with your deployed Google Apps Script Web App URL.
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFPhfdMhw8wQ8LBEwbOv1Chij26epfQDVDl5Srgul8j2zhi8CoRPVd3k1NrhWgawtoEw/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('entryForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

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

        const data = {
            schoolName: formData.get('schoolName'),
            contactName: formData.get('contactName'),
            contactEmail: formData.get('contactEmail'),
            estimatedTeams: formData.get('estimatedTeams'),
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
            });

            const result = await response.json();

            if (result.result === 'success') {
                showMessage('Success! Your interest has been registered.', 'success');
                form.reset();
            } else {
                console.log(result);
                throw new Error(result.error || 'Unknown error from server');
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
