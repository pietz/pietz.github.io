/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function() {

	var	window = this,
		body = document.body,
		wrapper = document.getElementById('wrapper'),
		header = document.getElementById('header'),
		footer = document.getElementById('footer'),
		main = document.getElementById('main'),
		main_articles = main.querySelectorAll('article');

	// Play initial animations on page load.
		window.addEventListener('load', function() {
			setTimeout(function() {
				body.classList.remove('is-preload');
			}, 100);
		});


	// Nav.
		var nav = header.querySelector('nav'),
			nav_li = nav.querySelectorAll('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if (nav_li.length % 2 == 0) {
				nav.classList.add('use-middle');
				nav_li[Math.floor(nav_li.length / 2)].classList.add('is-middle');
			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			main._show = function(id, initial) {

				var article = main.querySelector('#' + id);

				// No such article? Bail.
					if (!article)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								body.classList.add('is-switching');

							// Mark as visible.
								body.classList.add('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								main_articles.forEach(function(el) {
									el.classList.remove('active');
								});

							// Hide header, footer.
								header.style.display = 'none';
								footer.style.display = 'none';

							// Show main, article.
								main.style.display = 'block';
								article.style.display = 'block';

							// Activate article.
								article.classList.add('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									body.classList.remove('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if (body.classList.contains('is-article-visible')) {

						// Deactivate current article.
							var currentArticle = main.querySelector('.active');

							currentArticle.classList.remove('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									currentArticle.style.display = 'none';

								// Show article.
									article.style.display = 'block';

								// Activate article.
									setTimeout(function() {

										article.classList.add('active');

										// Window stuff.
											window.scrollTo(0, 0);
											if (typeof window.dispatchEvent === 'function') {
												window.dispatchEvent(new Event('resize'));
											}

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							body.classList.add('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									header.style.display = 'none';
									footer.style.display = 'none';

								// Show main, article.
									main.style.display = 'block';
									article.style.display = 'block';

								// Activate article.
									setTimeout(function() {

										article.classList.add('active');

										// Window stuff.
											window.scrollTo(0, 0);
											if (typeof window.dispatchEvent === 'function') {
												window.dispatchEvent(new Event('resize'));
											}

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			main._hide = function(addState) {

				var article = main.querySelector('.active');

				// Article not visible? Bail.
					if (!body.classList.contains('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								body.classList.add('is-switching');

							// Deactivate article.
								article.classList.remove('active');

							// Hide article, main.
								article.style.display = 'none';
								main.style.display = 'none';

							// Show footer, header.
								footer.style.display = 'block';
								header.style.display = 'block';

							// Unmark as visible.
								body.classList.remove('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								body.classList.remove('is-switching');

							// Window stuff.
								window.scrollTo(0, 0);
								if (typeof window.dispatchEvent === 'function') {
									window.dispatchEvent(new Event('resize'));
								}

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					article.classList.remove('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							article.style.display = 'none';
							main.style.display = 'none';

						// Show footer, header.
							footer.style.display = 'block';
							header.style.display = 'block';

						// Unmark as visible.
							setTimeout(function() {

								body.classList.remove('is-article-visible');

								// Window stuff.
									window.scrollTo(0, 0);
									if (typeof window.dispatchEvent === 'function') {
										window.dispatchEvent(new Event('resize'));
									}

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			main_articles.forEach(function(article) {

				// Close.
					var closeDiv = document.createElement('div');
					closeDiv.className = 'close';
					closeDiv.textContent = 'Close';
					closeDiv.addEventListener('click', function() {
						location.hash = '';
					});
					article.appendChild(closeDiv);

				// Prevent clicks from inside article from bubbling.
					article.addEventListener('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			body.addEventListener('click', function(event) {

				// Article visible? Hide.
					if (body.classList.contains('is-article-visible'))
						main._hide(true);

			});

			window.addEventListener('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if (body.classList.contains('is-article-visible'))
								main._hide(true);

						break;

					default:
						break;

				}

			});

			window.addEventListener('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							main._hide();

					}

				// Otherwise, check for a matching article.
					else if (main.querySelector(location.hash)) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0;

				window.addEventListener('scroll', function() {
					oldScrollPos = scrollPos;
					scrollPos = window.pageYOffset || document.documentElement.scrollTop;
				});

				window.addEventListener('hashchange', function() {
					window.scrollTo(0, oldScrollPos);
				});

			}

		// Initialize.

			// Hide main, articles.
				main.style.display = 'none';
				main_articles.forEach(function(article) {
					article.style.display = 'none';
				});

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					window.addEventListener('load', function() {
						main._show(location.hash.substr(1), true);
					});

})();