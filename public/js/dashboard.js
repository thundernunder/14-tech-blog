const newFormHandler = async (event) => {
	event.preventDefault();

	const blogTitle = document.querySelector('#blog-title').value.trim();

	const blogDescription = document.querySelector('#blog-desc').value.trim();

	if (blogTitle && blogDescription) {
		const response = await fetch(`/api/blogs`, {
			method: 'POST',
			body: JSON.stringify({ blogTitle, blogDescription }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.ok) {
			document.location.replace('/dashboard');
		} else {
			alert('Failed to create blog');
		}
	}
};

const deleteButtonHandler = async (event) => {
	if (event.target.hasAttribute('data-id')) {
		const dataID = event.target.getAttribute('data-id');

		const response = await fetch(`/api/blogs/${dataID}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			document.location.replace('/dashboard');
		} else {
			alert('Failed to delete blog');
		}
	}
};


document.querySelector('.new-blog-form')
document.addEventListener('submit', newFormHandler);

document.querySelector('.blog-list')
document.addEventListener('click', deleteButtonHandler);