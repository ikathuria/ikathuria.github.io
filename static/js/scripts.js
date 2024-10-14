document.addEventListener('DOMContentLoaded', function () {
	// Project card click event to show modal
	const projectCards = document.querySelectorAll('.project-card');
	projectCards.forEach(card => {
		card.addEventListener('click', function () {
			const modal = document.querySelector(`#${card.dataset.modal}`);
			modal.style.display = 'flex';
		});
	});

	// Close modal
	const closeButtons = document.querySelectorAll('.close-modal');
	closeButtons.forEach(button => {
		button.addEventListener('click', function () {
			button.closest('.modal').style.display = 'none';
		});
	});
});
