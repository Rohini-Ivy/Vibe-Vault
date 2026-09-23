const moodButtons = document.querySelectorAll(".mood-btn");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const songContainer = document.querySelector("#songContainer");

const favoritesContainer =
    document.querySelector("#favoritesContainer");

const favoriteCount =
    document.querySelector("#favoriteCount");

const emptyFavorites =
    document.querySelector("#emptyFavorites");

const historyContainer =
    document.querySelector("#historyContainer");

const emptyHistory =
    document.querySelector("#emptyHistory");

const clearHistoryButton =
    document.querySelector("#clearHistoryButton");


const moodSearchTerms = {
    happy: "happy pop",
    calm: "calm music",
    energetic: "energetic music",
    chill: "chill music",
    nostalgic: "nostalgic songs",
    melancholy: "melancholy music"
};


const musicPlayer =
    document.querySelector("#musicPlayer");

const audioPlayer =
    document.querySelector("#audioPlayer");

const playerArtwork =
    document.querySelector("#playerArtwork");

const playerTitle =
    document.querySelector("#playerTitle");

const playerArtist =
    document.querySelector("#playerArtist");

const playPauseButton =
    document.querySelector("#playPauseButton");

const progressBar =
    document.querySelector("#progressBar");

const currentTime =
    document.querySelector("#currentTime");

const duration =
    document.querySelector("#duration");

const previousButton =
    document.querySelector("#previousButton");

const nextButton =
    document.querySelector("#nextButton");

const volumeButton =
    document.querySelector("#volumeButton");


let currentSong = null;
let currentSongList = [];
let currentSongIndex = -1;


async function searchSongs(term) {

    if (!songContainer) {
        return;
    }

    songContainer.innerHTML = `
        <div class="col-span-full py-16 text-center">
            <div class="text-4xl">🎧</div>
            <p class="mt-4 text-slate-400">
                Searching for music...
            </p>
        </div>
    `;


    try {

        const response = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=12`
        );


        if (!response.ok) {
            throw new Error("Search request failed");
        }


        const data = await response.json();


        if (!data.results || data.results.length === 0) {

            songContainer.innerHTML = `
                <div class="col-span-full rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
                    <div class="text-4xl">😕</div>

                    <h3 class="mt-4 text-xl font-semibold">
                        No songs found
                    </h3>

                    <p class="mt-2 text-sm text-slate-400">
                        Try searching for another song or artist.
                    </p>
                </div>
            `;

            return;
        }


        displaySongs(data.results);

    } catch (error) {

        console.error(error);

        songContainer.innerHTML = `
            <div class="col-span-full rounded-2xl border border-red-900/50 bg-red-950/20 px-6 py-16 text-center">

                <div class="text-4xl">
                    ⚠️
                </div>

                <h3 class="mt-4 text-xl font-semibold">
                    Something went wrong
                </h3>

                <p class="mt-2 text-sm text-slate-400">
                    Please check your internet connection and try again.
                </p>

            </div>
        `;
    }
}


function displaySongs(songs) {

    if (!songContainer) {
        return;
    }


    songContainer.innerHTML = "";


    songs.forEach(song => {

        const card =
            document.createElement("div");


        card.className =
            "overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-purple-500/50";


        const artwork =
            song.artworkUrl100
                ? song.artworkUrl100.replace(
                    "100x100",
                    "400x400"
                )
                : "";


        card.innerHTML = `

            <img
                src="${artwork}"
                alt="${song.trackName}"
                class="h-64 w-full object-cover"
            >


            <div class="p-5">

                <h3
                    class="truncate text-lg font-semibold"
                    title="${song.trackName}">
                    ${song.trackName}
                </h3>


                <p
                    class="mt-1 truncate text-sm text-slate-400"
                    title="${song.artistName}">
                    ${song.artistName}
                </p>


                <p
                    class="mt-1 truncate text-xs text-slate-500"
                    title="${song.collectionName || ""}">
                    ${song.collectionName || "Unknown Album"}
                </p>


                <div class="mt-5 grid grid-cols-2 gap-2">

                    <button
                        class="play-song rounded-xl bg-purple-600 py-2 text-sm font-medium transition hover:bg-purple-500">
                        ▶ Play
                    </button>


                    <button
                        class="favorite-song rounded-xl border border-slate-700 py-2 text-sm transition hover:bg-slate-800">
                        ❤️ Save
                    </button>

                </div>


                <a
                    href="${song.trackViewUrl || "#"}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-2 block rounded-xl border border-slate-800 py-2 text-center text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white">
                    🔗 Open
                </a>

            </div>
        `;


        songContainer.appendChild(card);


        const playButton =
            card.querySelector(".play-song");


        const favoriteButton =
            card.querySelector(".favorite-song");


        playButton.addEventListener("click", () => {

            playSong(song, songs);

        });


        favoriteButton.addEventListener("click", () => {

            addFavorite(song);

            favoriteButton.textContent =
                "❤️ Saved";

        });

    });
}


function addFavorite(song) {

    let favorites =
        JSON.parse(
            localStorage.getItem("vibeFavorites")
        ) || [];


    const alreadyExists =
        favorites.some(
            favorite =>
                favorite.trackId === song.trackId
        );


    if (alreadyExists) {

        alert("Already in favorites ❤️");

        return;
    }


    favorites.push(song);


    localStorage.setItem(
        "vibeFavorites",
        JSON.stringify(favorites)
    );


    displayFavorites();
}


function displayFavorites() {

    if (!favoritesContainer) {
        return;
    }


    const favorites =
        JSON.parse(
            localStorage.getItem("vibeFavorites")
        ) || [];


    favoriteCount.textContent =
        `${favorites.length} ${
            favorites.length === 1
                ? "song"
                : "songs"
        }`;


    if (favorites.length === 0) {

        favoritesContainer.innerHTML = "";

        emptyFavorites.classList.remove("hidden");

        return;
    }


    emptyFavorites.classList.add("hidden");


    favoritesContainer.innerHTML = "";


    favorites.forEach(song => {

        const item =
            document.createElement("div");


        item.className =
            "flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 transition hover:border-purple-500/40";


        item.innerHTML = `

            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600/10 text-lg">
                🎵
            </div>


            <div class="min-w-0 flex-1">

                <h3
                    class="truncate font-medium"
                    title="${song.trackName}">
                    ${song.trackName}
                </h3>

            </div>


            <button
                class="play-favorite shrink-0 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium transition hover:bg-purple-500">
                ▶ <span class="hidden sm:inline">Play</span>
            </button>


            <button
                class="remove-favorite shrink-0 rounded-xl border border-slate-700 px-3 py-2 text-sm transition hover:bg-slate-800"
                title="Remove from favorites">
                🗑
            </button>
        `;


        favoritesContainer.appendChild(item);


        const playButton =
            item.querySelector(".play-favorite");


        const removeButton =
            item.querySelector(".remove-favorite");


        playButton.addEventListener(
            "click",
            () => {

                const latestFavorites =
                    JSON.parse(
                        localStorage.getItem(
                            "vibeFavorites"
                        )
                    ) || [];


                playSong(
                    song,
                    latestFavorites
                );

            }
        );


        removeButton.addEventListener(
            "click",
            () => {

                removeFavorite(
                    song.trackId
                );

            }
        );

    });
}


function removeFavorite(trackId) {

    let favorites =
        JSON.parse(
            localStorage.getItem("vibeFavorites")
        ) || [];


    favorites =
        favorites.filter(
            song =>
                song.trackId !== trackId
        );


    localStorage.setItem(
        "vibeFavorites",
        JSON.stringify(favorites)
    );


    displayFavorites();
}


function addToHistory(song) {

    if (!song || !song.trackId) {
        return;
    }


    let history =
        JSON.parse(
            localStorage.getItem("vibeHistory")
        ) || [];


    history =
        history.filter(
            item =>
                item.trackId !== song.trackId
        );


    history.unshift(song);


    history =
        history.slice(0, 10);


    localStorage.setItem(
        "vibeHistory",
        JSON.stringify(history)
    );


    displayHistory();
}


function displayHistory() {

    if (!historyContainer) {
        return;
    }


    const history =
        JSON.parse(
            localStorage.getItem("vibeHistory")
        ) || [];


    if (history.length === 0) {

        historyContainer.innerHTML = "";

        emptyHistory.classList.remove("hidden");

        return;
    }


    emptyHistory.classList.add("hidden");


    historyContainer.innerHTML = "";


    history.forEach(song => {

        const item =
            document.createElement("div");


        item.className =
            "flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 transition hover:border-purple-500/40";


        item.innerHTML = `

            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-lg">
                🎵
            </div>


            <div class="min-w-0 flex-1">

                <h3
                    class="truncate font-medium"
                    title="${song.trackName}">
                    ${song.trackName}
                </h3>

            </div>


            <button
                class="play-history shrink-0 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium transition hover:bg-purple-500">
                ▶ <span class="hidden sm:inline">Play Again</span>
            </button>

        `;


        historyContainer.appendChild(item);


        const playButton =
            item.querySelector(".play-history");


        playButton.addEventListener(
            "click",
            () => {

                const latestHistory =
                    JSON.parse(
                        localStorage.getItem(
                            "vibeHistory"
                        )
                    ) || [];


                playSong(
                    song,
                    latestHistory
                );

            }
        );

    });
}


function playSong(
    song,
    songList = []
) {

    if (!song.previewUrl) {

        alert(
            "Preview unavailable for this song."
        );

        return;
    }


    currentSong = song;


    currentSongList =
        Array.isArray(songList)
            ? songList
            : [];


    currentSongIndex =
        currentSongList.findIndex(
            item =>
                item.trackId === song.trackId
        );


    audioPlayer.src =
        song.previewUrl;


    audioPlayer.currentTime = 0;


    playerTitle.textContent =
        song.trackName || "Unknown Song";


    playerArtist.textContent =
        song.artistName || "Unknown Artist";


    if (song.artworkUrl100) {

        playerArtwork.src =
            song.artworkUrl100.replace(
                "100x100",
                "400x400"
            );

        playerArtwork.classList.remove(
            "hidden"
        );

    }


    musicPlayer.classList.remove(
        "hidden"
    );


    addToHistory(song);


    audioPlayer.play()
        .then(() => {

            playPauseButton.textContent =
                "⏸";

        })
        .catch(error => {

            console.log(
                "Playback could not start:",
                error
            );

            playPauseButton.textContent =
                "▶";

        });

}


if (playPauseButton) {

    playPauseButton.addEventListener(
        "click",
        () => {

            if (!currentSong) {
                return;
            }


            if (audioPlayer.paused) {

                audioPlayer.play()
                    .then(() => {

                        playPauseButton.textContent =
                            "⏸";

                    });

            } else {

                audioPlayer.pause();

                playPauseButton.textContent =
                    "▶";

            }

        }
    );

}


if (audioPlayer) {

    audioPlayer.addEventListener(
        "loadedmetadata",
        () => {

            progressBar.max =
                audioPlayer.duration;


            duration.textContent =
                formatTime(
                    audioPlayer.duration
                );

        }
    );


    audioPlayer.addEventListener(
        "timeupdate",
        () => {

            progressBar.value =
                audioPlayer.currentTime;


            currentTime.textContent =
                formatTime(
                    audioPlayer.currentTime
                );

        }
    );


    audioPlayer.addEventListener(
        "play",
        () => {

            if (playPauseButton) {
                playPauseButton.textContent =
                    "⏸";
            }

        }
    );


    audioPlayer.addEventListener(
        "pause",
        () => {

            if (playPauseButton) {
                playPauseButton.textContent =
                    "▶";
            }

        }
    );


    audioPlayer.addEventListener(
        "ended",
        () => {

            if (
                currentSongIndex !== -1 &&
                currentSongList.length > 0
            ) {

                const nextIndex =
                    (
                        currentSongIndex + 1
                    ) %
                    currentSongList.length;


                playSong(
                    currentSongList[nextIndex],
                    currentSongList
                );

            } else {

                playPauseButton.textContent =
                    "▶";

            }

        }
    );

}


if (progressBar) {

    progressBar.addEventListener(
        "input",
        () => {

            audioPlayer.currentTime =
                progressBar.value;

        }
    );

}


function formatTime(seconds) {

    if (
        isNaN(seconds) ||
        !isFinite(seconds)
    ) {

        return "0:00";
    }


    const minutes =
        Math.floor(seconds / 60);


    const remainingSeconds =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");


    return `${minutes}:${remainingSeconds}`;
}


if (nextButton) {

    nextButton.addEventListener(
        "click",
        () => {

            if (
                currentSongIndex === -1 ||
                currentSongList.length === 0
            ) {

                return;
            }


            const nextIndex =
                (
                    currentSongIndex + 1
                ) %
                currentSongList.length;


            playSong(
                currentSongList[nextIndex],
                currentSongList
            );

        }
    );

}


if (previousButton) {

    previousButton.addEventListener(
        "click",
        () => {

            if (
                currentSongIndex === -1 ||
                currentSongList.length === 0
            ) {

                return;
            }


            const previousIndex =
                (
                    currentSongIndex -
                    1 +
                    currentSongList.length
                ) %
                currentSongList.length;


            playSong(
                currentSongList[previousIndex],
                currentSongList
            );

        }
    );

}


if (volumeButton) {

    volumeButton.addEventListener(
        "click",
        () => {

            audioPlayer.muted =
                !audioPlayer.muted;


            volumeButton.textContent =
                audioPlayer.muted
                    ? "🔇"
                    : "🔊";

        }
    );

}


if (searchButton && searchInput) {

    searchButton.addEventListener(
        "click",
        () => {

            const searchText =
                searchInput.value.trim();


            if (searchText === "") {

                alert(
                    "Please enter a song or artist name."
                );

                return;
            }


            searchSongs(searchText);

        }
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                searchButton.click();

            }

        }
    );

}


moodButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const mood =
                button.dataset.mood;


            moodButtons.forEach(
                btn => {

                    btn.classList.remove(
                        "border-purple-500",
                        "bg-purple-600/20"
                    );

                }
            );


            button.classList.add(
                "border-purple-500",
                "bg-purple-600/20"
            );


            searchSongs(
                moodSearchTerms[mood]
            );

        }
    );

});


if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        () => {

            const history =
                JSON.parse(
                    localStorage.getItem(
                        "vibeHistory"
                    )
                ) || [];


            if (history.length === 0) {

                return;
            }


            const confirmClear =
                confirm(
                    "Clear your entire listening history?"
                );


            if (!confirmClear) {
                return;
            }


            localStorage.removeItem(
                "vibeHistory"
            );


            displayHistory();

        }
    );

}


displayFavorites();
displayHistory();