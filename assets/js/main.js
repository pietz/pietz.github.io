/*
	Dimension by HTML5 UP - Vanilla JS Version
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function() {
	'use strict';

	// Elements
	const $window = window;
	const $body = document.body;
	const $wrapper = document.getElementById('wrapper');
	const $header = document.getElementById('header');
	const $footer = document.getElementById('footer');
	const $main = document.getElementById('main');
	const $main_articles = Array.from($main.children).filter(el => el.tagName === 'ARTICLE');

	// Breakpoints (simplified object instead of library)
	const breakpoints = {
		xlarge:   [ '1281px',  '1680px' ],
		large:    [ '981px',   '1280px' ],
		medium:   [ '737px',   '980px'  ],
		small:    [ '481px',   '736px'  ],
		xsmall:   [ '361px',   '480px'  ],
		xxsmall:  [ null,      '360px'  ]
	};

	// Play initial animations on page load
	$window.addEventListener('load', function() {
		setTimeout(function() {
			$body.classList.remove('is-preload');
		}, 100);
	});

	// Nav
	const $nav = $header.querySelector('nav');
	const $nav_li = Array.from($nav.querySelectorAll('li'));

	// Add "middle" alignment classes if we're dealing with an even number of items
	if ($nav_li.length % 2 === 0) {
		$nav.classList.add('use-middle');
		$nav_li[Math.floor($nav_li.length / 2)].classList.add('is-middle');
	}

	// Main
	let delay = 325;
	let locked = false;

	// Helper functions
	function show(element) {
		element.style.display = '';
	}

	function hide(element) {
		element.style.display = 'none';
	}

	function triggerResize() {
		window.dispatchEvent(new Event('resize'));
	}

	// Main methods
	const Main = {
		_show: function(id, initial) {
			const $article = $main_articles.find(el => el.id === id);

			// No such article? Bail
			if (!$article) return;

			// Handle lock
			// Already locked? Speed through "show" steps w/o delays
			if (locked || (typeof initial !== 'undefined' && initial === true)) {
				// Mark as switching
				$body.classList.add('is-switching');

				// Mark as visible
				$body.classList.add('is-article-visible');

				// Deactivate all articles (just in case one's already active)
				$main_articles.forEach(article => article.classList.remove('active'));

				// Hide header, footer
				hide($header);
				hide($footer);

				// Show main, article
				show($main);
				show($article);

				// Activate article
				$article.classList.add('active');

				// Unlock
				locked = false;

				// Unmark as switching
				setTimeout(function() {
					$body.classList.remove('is-switching');
				}, (initial ? 1000 : 0));

				return;
			}

			// Lock
			locked = true;

			// Article already visible? Just swap articles
			if ($body.classList.contains('is-article-visible')) {
				// Deactivate current article
				const $currentArticle = $main_articles.find(el => el.classList.contains('active'));

				if ($currentArticle) {
					$currentArticle.classList.remove('active');
				}

				// Show article
				setTimeout(function() {
					// Hide current article
					if ($currentArticle) {
						hide($currentArticle);
					}

					// Show article
					show($article);

					// Activate article
					setTimeout(function() {
						$article.classList.add('active');

						// Window stuff
						window.scrollTo(0, 0);
						triggerResize();

						// Unlock
						setTimeout(function() {
							locked = false;
						}, delay);
					}, 25);
				}, delay);
			}
			// Otherwise, handle as normal
			else {
				// Mark as visible
				$body.classList.add('is-article-visible');

				// Show article
				setTimeout(function() {
					// Hide header, footer
					hide($header);
					hide($footer);

					// Show main, article
					show($main);
					show($article);

					// Activate article
					setTimeout(function() {
						$article.classList.add('active');

						// Window stuff
						window.scrollTo(0, 0);
						triggerResize();

						// Unlock
						setTimeout(function() {
							locked = false;
						}, delay);
					}, 25);
				}, delay);
			}
		},

		_hide: function(addState) {
			const $article = $main_articles.find(el => el.classList.contains('active'));

			// Article not visible? Bail
			if (!$body.classList.contains('is-article-visible')) return;

			// Add state?
			if (typeof addState !== 'undefined' && addState === true) {
				history.pushState(null, null, '#');
			}

			// Handle lock
			// Already locked? Speed through "hide" steps w/o delays
			if (locked) {
				// Mark as switching
				$body.classList.add('is-switching');

				// Deactivate article
				if ($article) {
					$article.classList.remove('active');
				}

				// Hide article, main
				if ($article) {
					hide($article);
				}
				hide($main);

				// Show footer, header
				show($footer);
				show($header);

				// Unmark as visible
				$body.classList.remove('is-article-visible');

				// Unlock
				locked = false;

				// Unmark as switching
				$body.classList.remove('is-switching');

				// Window stuff
				window.scrollTo(0, 0);
				triggerResize();

				return;
			}

			// Lock
			locked = true;

			// Deactivate article
			if ($article) {
				$article.classList.remove('active');
			}

			// Hide article
			setTimeout(function() {
				// Hide article, main
				if ($article) {
					hide($article);
				}
				hide($main);

				// Show footer, header
				show($footer);
				show($header);

				// Unmark as visible
				setTimeout(function() {
					$body.classList.remove('is-article-visible');

					// Window stuff
					window.scrollTo(0, 0);
					triggerResize();

					// Unlock
					setTimeout(function() {
						locked = false;
					}, delay);
				}, 25);
			}, delay);
		}
	};

	// Articles
	$main_articles.forEach(function(article) {
		// Close
		const closeButton = document.createElement('div');
		closeButton.className = 'close';
		closeButton.textContent = 'Close';
		article.appendChild(closeButton);

		closeButton.addEventListener('click', function() {
			location.hash = '';
		});

		// Prevent clicks from inside article from bubbling
		article.addEventListener('click', function(event) {
			event.stopPropagation();
		});
	});

	// Events
	$body.addEventListener('click', function(event) {
		// Article visible? Hide
		if ($body.classList.contains('is-article-visible')) {
			Main._hide(true);
		}
	});

	$window.addEventListener('keyup', function(event) {
		switch (event.keyCode) {
			case 27:
				// Article visible? Hide
				if ($body.classList.contains('is-article-visible')) {
					Main._hide(true);
				}
				break;
			default:
				break;
		}
	});

	$window.addEventListener('hashchange', function(event) {
		// Empty hash?
		if (location.hash === '' || location.hash === '#') {
			// Prevent default
			event.preventDefault();
			event.stopPropagation();

			// Hide
			Main._hide();
		}
		// Otherwise, check for a matching article
		else if ($main_articles.some(article => '#' + article.id === location.hash)) {
			// Prevent default
			event.preventDefault();
			event.stopPropagation();

			// Show article
			Main._show(location.hash.substr(1));
		}
	});

	// Scroll restoration
	// This prevents the page from scrolling back to the top on a hashchange
	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	} else {
		let oldScrollPos = 0;
		let scrollPos = 0;

		$window.addEventListener('scroll', function() {
			oldScrollPos = scrollPos;
			scrollPos = window.pageYOffset || document.documentElement.scrollTop;
		});

		$window.addEventListener('hashchange', function() {
			window.scrollTo(0, oldScrollPos);
		});
	}

	// Initialize
	// Hide main, articles
	hide($main);
	$main_articles.forEach(hide);

	// Initial article
	if (location.hash !== '' && location.hash !== '#') {
		$window.addEventListener('load', function() {
			Main._show(location.hash.substr(1), true);
		});
	}

})();