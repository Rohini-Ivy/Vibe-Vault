const moodButtons = document.querySelectorAll(".mood-btn");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const songContainer = document.querySelector("#songContainer");

const moodSearchTerms = {
    happy: "happy pop",
    calm: "calm music",
    energetic: "energetic",
    chill: "chill music",
    nostalgic: "nostalgic",
    melancholy: "sad music"
};

async function searchSongs(term) {
    songContainer.innerHTML = `
        <div class="sm:col-span-2 lg:col-span-3 text-center py-10">
            <p class="text-slate-400">Searching for music...</p>
        </div>
    `;

    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=12`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length === 0) {
            songContainer.innerHTML = `
                <div class="sm:col-span-2 lg:col-span-3 text-center py-10">
                    <div class="text-5xl">😕</div>
                    <h4 class="mt-4 text-lg font-semibold">
                        No songs found
                    </h4>
                    <p class="mt-2 text-slate-500">
                        Try another song or artist.
                    </p>
                </div>
            `;

            return;
        }

        displaySongs(data.results);

    } catch (error) {
        console.error(error);

        songContainer.innerHTML = `
            <div class="sm:col-span-2 lg:col-span-3 text-center py-10">
                <div class="text-5xl">⚠️</div>
                <h4 class="mt-4 text-lg font-semibold">
                    Something went wrong
                </h4>
                <p class="mt-2 text-slate-500">
                    Please try again.
                </p>
            </div>
        `;
    }
}


function displaySongs(songs) {
    songContainer.innerHTML = "";

    songs.forEach(song => {

        const card = document.createElement("div");

        card.className = `
            overflow-hidden rounded-2xl border border-slate-800
            bg-slate-900 transition
            hover:-translate-y-1 hover:border-purple-500
        `;

        const artwork = song.artworkUrl100
            ? song.artworkUrl100.replace("100x100", "400x400")
            : "";

        card.innerHTML = `
            <img
                src="${artwork}"
                alt="${song.trackName}"
                class="h-64 w-full object-cover"
            >

            <div class="p-5">

                <h4 class="truncate text-lg font-semibold">
                    ${song.trackName}
                </h4>

                <p class="mt-1 truncate text-sm text-slate-400">
                    ${song.artistName}
                </p>

                <p class="mt-2 truncate text-xs text-slate-500">
                    ${song.collectionName || "Unknown Album"}
                </p>

                <div class="mt-5 flex items-center gap-3">

                    ${
                        song.previewUrl
                        ? `
                        <audio
                            controls
                            class="h-10 w-full"
                            src="${song.previewUrl}">
                        </audio>
                        `
                        : `
                        <p class="text-sm text-slate-500">
                            Preview unavailable
                        </p>
                        `
                    }

                </div>

                <div class="mt-4 flex gap-2">

                    <button
                        class="favorite-btn flex-1 rounded-xl border border-slate-700 py-2 text-sm hover:bg-slate-800"
                        data-id="${song.trackId}"
                    >
                        ♡ Favorite
                    </button>

                    <a
                        href="${song.trackViewUrl}"
                        target="_blank"
                        class="rounded-xl bg-purple-600 px-4 py-2 text-sm hover:bg-purple-500"
                    >
                        Open
                    </a>

                </div>

            </div>
        `;

        songContainer.appendChild(card);
    });
}


searchButton.addEventListener("click", () => {

    const searchText = searchInput.value.trim();

    if (searchText === "") {
        alert("Please enter a song or artist name.");
        return;
    }

    searchSongs(searchText);
});


searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        searchButton.click();
    }

});


moodButtons.forEach(button => {

    button.addEventListener("click", () => {

        const mood = button.dataset.mood;

        moodButtons.forEach(btn => {
            btn.classList.remove(
                "border-purple-500",
                "bg-purple-600/20"
            );
        });

        button.classList.add(
            "border-purple-500",
            "bg-purple-600/20"
        );

        searchSongs(moodSearchTerms[mood]);
    });

});