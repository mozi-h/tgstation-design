// jshint esversion: 6
var closedElementsHandler, settingsHandler;

window.addEventListener("load", () => {
	var dropdownElementList = [].slice.call(
		document.querySelectorAll(".dropdown-toggle")
	);
	var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
		return new bootstrap.Dropdown(dropdownToggleEl);
	});

	/* ------------------------ Closed Elements Handling ------------------------ */

	closedElementsHandler = {
		closedElementsList: null,
		initialize: function () {
			// Populate this.closedElementsList from localStorage
			this.closedElementsList = this.getLocalStorage();

			// Close all elements on the closedElementsList
			{
				var localStorageNeedsUpdate = false;
				this.closedElementsList.forEach((closedElement, closedElementIndex) => {
					var elem = document.getElementById(closedElement);
					if (elem) elem.remove();
					else {
						// Element could not be found. This should not happen, remove it from the list of closed elements
						this.closedElementsList.splice(closedElementIndex, 1);
						localStorageNeedsUpdate = true;
					}
				});
				if (localStorageNeedsUpdate) closedElementsHandler.updateLocalStorage();
			}
		},
		getLocalStorage: function () {
			// Get the list of closed elements from local Storage
			var localStorageData = localStorage.getItem("closedElements");
			if (localStorageData) return localStorageData.split(";");
			return [];
		},
		updateLocalStorage: function () {
			localStorage.setItem("closedElements", this.closedElementsList.join(";"));
		},
		addElement: function (elementId) {
			// Check if element exists
			var element = document.getElementById(elementId);
			if (!element) return false;

			// Add to list; save
			this.closedElementsList.push(elementId);
			this.updateLocalStorage();

			// Remove element now
			element.remove();
		},
		removeElement: function (elementId) {
			var elementIndex = this.closedElementsList.indexOf(elementId);
			if (elementIndex === -1) return false;
			this.closedElementsList.splice(elementIndex, 1);
			this.updateLocalStorage();
		},
		reset() {
			this.closedElementsList = [];
			localStorage.removeItem("closedElements");
		},
	};
	closedElementsHandler.initialize();

	// Bind closedElementsHandler.addElement to dismiss buttons
	var closeElementList = document.querySelectorAll(
		".custom-close[data-close-target]"
	);
	closeElementList.forEach((closeElement) => {
		closeElement.addEventListener("click", function (event) {
			closedElementsHandler.addElement(this.dataset.closeTarget);
		});
	});

	/* -------------------------------- Settings -------------------------------- */
	settingsHandler = {};

	// Manual background animation toggle
	// #toggleBgAnimation
	settingsHandler.bgAnimation = {
		breakBgAnimStylesheet: null,
		bgAnimToggler: document.getElementById("toggleBgAnimation"),
		set: function (enabled) {
			if (enabled) {
				if (!this.breakBgAnimStylesheet) return; // Not broken anyways

				// Unbreak bg animation
				this.breakBgAnimStylesheet.remove();
				this.breakBgAnimStylesheet = null;

				// Save status (not saved defaults to on)
				localStorage.removeItem("bgAnimation");
			} else {
				if (this.breakBgAnimStylesheet) return; // Already broken

				// Break bg animation
				this.breakBgAnimStylesheet = document.createElement("style", {
					type: "text/css",
				});
				this.breakBgAnimStylesheet.innerText = "@keyframes animStar {}";
				document.head.appendChild(this.breakBgAnimStylesheet);

				// Save status
				localStorage.setItem("bgAnimation", "false");
			}
		},
		initialize: function () {
			var storedStatus = localStorage.getItem("bgAnimation");
			if (storedStatus === null) storedStatus = true;
			else storedStatus = storedStatus === "true";

			this.bgAnimToggler.checked = storedStatus;
			this.set(storedStatus);

			// Bind settingsHandler.bgAnimation.set to its settings checkbox toggler
			this.bgAnimToggler.addEventListener("change", function (event) {
				settingsHandler.bgAnimation.set(this.checked);
			});
		},
		reset: function () {
			this.set(true);
			localStorage.removeItem("bgAnimation");
		},
	};
	settingsHandler.bgAnimation.initialize();

	// resetLocalStorage
	document
		.getElementById("resetLocalStorage")
		.addEventListener("click", function (event) {
			closedElementsHandler.reset();
			settingsHandler.bgAnimation.reset();

			this.disabled = true;
			this.classList.remove("btn-secondary");
			this.classList.add("btn-success");
			setTimeout(() => {
				window.location.reload(false);
			}, 50);
		});
});
