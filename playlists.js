
const STORAGE_KEY = "vibevault_playlists";

let playlists = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || "[]"
);

let selectedPlaylist = null;
let currentSongs = [];
let songToSave = null;

const $ = id => document.getElementById(id);

// ================================
// FEATURED PLAYLISTS
// ================================

const featured = [
  {
    heading: "Made for Your Mood ✨",
    items: [
      {
        name: "Happy Hits ☀️",
        query: "happy hits",
        color: "from-yellow-500 to-orange-600",
        emoji: "☀️"
      },
      {
        name: "Midnight Feels 🌙",
        query: "sad songs",
        color: "from-blue-900 to-purple-800",
        emoji: "🌙"
      },
      {
        name: "Love Notes 💗",
        query: "romantic hits",
        color: "from-pink-500 to-rose-800",
        emoji: "💗"
      },
      {
        name: "Energy Boost ⚡",
        query: "dance hits",
        color: "from-purple-500 to-indigo-800",
        emoji: "⚡"
      }
    ]
  },

  {
    heading: "Explore by Language 🌍",
    items: [
      {
        name: "Telugu Trending",
        query: "Telugu hits",
        color: "from-orange-500 to-red-800",
        emoji: "🎶"
      },
      {
        name: "Hindi Hits",
        query: "Bollywood hits",
        color: "from-pink-500 to-purple-800",
        emoji: "🎤"
      },
      {
        name: "English Pop",
        query: "English pop",
        color: "from-blue-500 to-indigo-800",
        emoji: "🎧"
      },
      {
        name: "Tamil Beats",
        query: "Tamil hits",
        color: "from-green-500 to-teal-800",
        emoji: "🎼"
      }
    ]
  },

  {
    heading: "Choose Your Vibe 🎵",
    items: [
      {
        name: "Rainy Days",
        query: "rainy day songs",
        color: "from-slate-500 to-blue-900",
        emoji: "🌧️"
      },
      {
        name: "Long Drive",
        query: "road trip songs",
        color: "from-orange-600 to-purple-800",
        emoji: "🚗"
      },
      {
        name: "90s Nostalgia",
        query: "90s hits",
        color: "from-pink-700 to-purple-900",
        emoji: "📼"
      },
      {
        name: "Lo-Fi Chill",
        query: "lofi chill",
        color: "from-teal-600 to-blue-900",
        emoji: "🎧"
      },
      {
        name: "Party Mix",
        query: "party hits",
        color: "from-fuchsia-600 to-purple-900",
        emoji: "🎉"
      },
      {
        name: "Acoustic",
        query: "acoustic songs",
        color: "from-amber-600 to-stone-800",
        emoji: "🎸"
      }
    ]
  },

  {
    heading: "Fresh Releases 🔥",
    items: [
      {
        name: "New Telugu",
        query: "Telugu songs",
        recent: true,
        color: "from-orange-500 to-red-700",
        emoji: "🔥"
      },
      {
        name: "New Hindi",
        query: "Bollywood songs",
        recent: true,
        color: "from-pink-500 to-purple-700",
        emoji: "🎤"
      },
      {
        name: "New English",
        query: "pop music",
        recent: true,
        color: "from-blue-500 to-indigo-700",
        emoji: "🎧"
      },
      {
        name: "New Tamil",
        query: "Tamil songs",
        recent: true,
        color: "from-green-500 to-teal-700",
        emoji: "🎶"
      }
    ]
  }
];

// ================================
// SAVE USER PLAYLISTS
// ================================

function save() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(playlists)
  );
}

// ================================
// CREATE PLAYLIST CARDS
// ================================

function makeCard(title, subtitle, color, emoji, onClick) {
  const card = document.createElement("button");

  card.className = "text-left group w-full";

  const cover = document.createElement("div");

  cover.className = `
    aspect-square rounded-xl bg-gradient-to-br
    ${color} flex items-center justify-center
    text-6xl group-hover:scale-[1.03] transition
  `;

  cover.textContent = emoji;

  const name = document.createElement("h3");
  name.className = "font-semibold mt-3";
  name.textContent = title;

  const info = document.createElement("p");
  info.className = "text-sm text-gray-400 mt-1";
  info.textContent = subtitle;

  card.append(cover, name, info);
  card.addEventListener("click", onClick);

  return card;
}

// ================================
// DISPLAY USER PLAYLISTS
// ================================

function renderUserPlaylists() {
  const container = $("userPlaylists");
  container.replaceChildren();

  playlists.forEach(playlist => {
    container.appendChild(
      makeCard(
        playlist.name,
        `${playlist.songs.length} songs`,
        "from-purple-700 to-pink-700",
        "🎵",
        () => openUserPlaylist(playlist.id)
      )
    );
  });

  container.appendChild(
    makeCard(
      "New Playlist",
      "Create your collection",
      "from-gray-800 to-purple-950",
      "＋",
      openModal
    )
  );
}

// ================================
// DISPLAY FEATURED PLAYLISTS
// ================================

function renderFeatured() {
  const container = $("featuredSections");
  container.replaceChildren();

  featured.forEach(section => {
    const wrapper = document.createElement("section");
    wrapper.className = "mb-12";

    const heading = document.createElement("h2");
    heading.className = "text-2xl font-bold mb-6";
    heading.textContent = section.heading;

    const grid = document.createElement("div");
    grid.className =
      "grid grid-cols-2 md:grid-cols-4 gap-5";

    section.items.forEach(item => {
      grid.appendChild(
        makeCard(
          item.name,
          "Featured playlist",
          item.color,
          item.emoji,
          () => openFeatured(item)
        )
      );
    });

    wrapper.append(heading, grid);
    container.appendChild(wrapper);
  });
}

// ================================
// CREATE USER PLAYLIST
// ================================

function openModal() {
  $("playlistModal").classList.remove("hidden");
  $("playlistName").focus();
}

function closeModal() {
  $("playlistModal").classList.add("hidden");
  $("playlistForm").reset();
}

$("createBtn").addEventListener("click", openModal);

$("cancelBtn").addEventListener("click", () => {
  closeModal();

  if (songToSave && $("saveSongModal")) {
    $("saveSongModal").classList.remove("hidden");
  }
});

$("playlistForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("playlistName").value.trim();
  const description =
    $("playlistDescription").value.trim();

  if (!name) return;

  const playlist = {
    id: crypto.randomUUID(),
    name,
    description,
    songs: []
  };

  playlists.push(playlist);

  save();
  renderUserPlaylists();
  closeModal();

  if (songToSave && $("saveSongModal")) {
    renderPlaylistOptions();

    const checkbox = Array.from(
      $("playlistOptions").querySelectorAll(
        'input[type="checkbox"]'
      )
    ).find(input => input.value === playlist.id);

    if (checkbox) checkbox.checked = true;

    $("saveSongModal").classList.remove("hidden");
  }
});

// ================================
// DISPLAY PLAYLIST DETAILS
// ================================

function showDetails(title, description) {
  $("playlistDetails").classList.remove("hidden");

  $("selectedTitle").textContent = title;
  $("selectedDescription").textContent =
    description || "";

  $("songList").replaceChildren();

  $("playlistDetails").scrollIntoView({
    behavior: "smooth"
  });
}

function closeDetails() {
  $("playlistDetails").classList.add("hidden");
  selectedPlaylist = null;
}

$("backBtn").addEventListener("click", closeDetails);

// ================================
// CREATE BUTTONS
// ================================

function makeButton(
  label,
  onClick,
  color = "bg-purple-600"
) {
  const button = document.createElement("button");

  button.className =
    `${color} px-3 py-2 rounded-lg text-sm`;

  button.textContent = label;
  button.addEventListener("click", onClick);

  return button;
}

// ================================
// DISPLAY SONGS
// ================================

function renderSongs(songs, isPersonal = false) {
  const list = $("songList");
  list.replaceChildren();

  if (!songs.length) {
    list.textContent = "No songs found.";
    return;
  }

  songs.forEach(song => {
    const row = document.createElement("div");

    row.className =
      "flex flex-wrap items-center gap-3 " +
      "bg-[#302640] p-3 rounded-xl";

    const cover = document.createElement("img");
    cover.src = song.artworkUrl100 || "";
    cover.alt = "";
    cover.className =
      "w-14 h-14 rounded-lg object-cover";

    const details = document.createElement("div");
    details.className = "flex-1 min-w-32";

    const title = document.createElement("p");
    title.className = "font-semibold";
    title.textContent = song.trackName;

    const artist = document.createElement("p");
    artist.className = "text-sm text-gray-400";
    artist.textContent = song.artistName;

    details.append(title, artist);
    row.append(cover, details);

    if (song.previewUrl) {
      row.appendChild(
        makeButton("▶ Play", () => playSong(song))
      );
    }

    if (isPersonal) {
      row.appendChild(
        makeButton(
          "Remove",
          () => removeSong(song.trackId),
          "bg-red-800"
        )
      );
    } else {
      row.appendChild(
        makeButton(
          "+ Save",
          () => addToPlaylist(song)
        )
      );
    }

    list.appendChild(row);
  });
}

// ================================
// OPEN USER PLAYLIST
// ================================

function openUserPlaylist(id) {
  const playlist = playlists.find(p => p.id === id);

  if (!playlist) return;

  selectedPlaylist = id;

  showDetails(playlist.name, playlist.description);
  renderSongs(playlist.songs, true);

  const actions = document.createElement("div");
  actions.className = "flex flex-wrap gap-3 mb-5";

  actions.appendChild(
    makeButton("Rename", () => {
      const name = prompt(
        "New playlist name:",
        playlist.name
      );

      if (!name?.trim()) return;

      playlist.name = name.trim();

      save();
      renderUserPlaylists();
      openUserPlaylist(id);
    })
  );

  actions.appendChild(
    makeButton(
      "Delete Playlist",
      () => {
        if (!confirm(`Delete "${playlist.name}"?`)) {
          return;
        }

        playlists = playlists.filter(
          p => p.id !== id
        );

        save();
        renderUserPlaylists();
        closeDetails();
      },
      "bg-red-800"
    )
  );

  $("songList").prepend(actions);
}

// ================================
// FETCH FEATURED SONGS
// ================================

async function openFeatured(item) {
  selectedPlaylist = null;

  showDetails(
    item.name,
    "Discover old favorites and recent releases."
  );

  const list = $("songList");
  list.textContent = "Loading songs...";

  try {
    const url = new URL(
      "https://itunes.apple.com/search"
    );

    url.searchParams.set("term", item.query);
    url.searchParams.set("media", "music");
    url.searchParams.set("entity", "song");
    url.searchParams.set("country", "IN");
    url.searchParams.set("limit", "200");
    url.searchParams.set("explicit", "No");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Music search failed");
    }

    const data = await response.json();

    const today = new Date();

    let songs = (data.results || [])
      .filter(song => {
        if (!song.releaseDate) return false;

        const releaseDate = new Date(
          song.releaseDate
        );

        return (
          !isNaN(releaseDate.getTime()) &&
          releaseDate <= today &&
          song.previewUrl
        );
      });

    // Remove duplicate tracks.
    const seen = new Set();

    songs = songs.filter(song => {
      if (seen.has(song.trackId)) return false;

      seen.add(song.trackId);
      return true;
    });

    // Newest matching releases appear first.
    songs.sort(
      (a, b) =>
        new Date(b.releaseDate) -
        new Date(a.releaseDate)
    );

    if (item.recent) {
      // Prefer songs from the last 90 days.
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);

      songs = songs.filter(
        song => new Date(song.releaseDate) >= cutoff
      );
    } else if (item.name !== "90s Nostalgia") {
      // Mix recent and older songs when available.
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 2);

      const recent = songs.filter(
        song => new Date(song.releaseDate) >= cutoff
      );

      const older = songs.filter(
        song => new Date(song.releaseDate) < cutoff
      );

      const mixed = [];

      while (
        mixed.length < 40 &&
        (recent.length || older.length)
      ) {
        mixed.push(...recent.splice(0, 3));
        mixed.push(...older.splice(0, 2));
      }

      songs = mixed;
    } else {
      songs = songs.filter(song => {
        const year = new Date(
          song.releaseDate
        ).getFullYear();

        return year >= 1990 && year <= 1999;
      });
    }

    currentSongs = songs.slice(0, 40);

    if (!currentSongs.length) {
      list.textContent =
        "No matching songs found. Try another playlist.";
      return;
    }

    renderSongs(currentSongs);

  } catch (error) {
    console.error(error);

    list.textContent =
      "Unable to load songs. Please try again.";
  }
}

// ================================
// ADD SONG TO USER PLAYLIST
// ================================

function addToPlaylist(song) {
  songToSave = song;

  // Use the playlist selector when available.
  if ($("saveSongModal")) {
    $("saveSongCover").src =
      song.artworkUrl100 || "";

    $("saveSongTitle").textContent =
      song.trackName;

    $("saveSongArtist").textContent =
      song.artistName;

    renderPlaylistOptions();

    $("saveSongModal").classList.remove("hidden");
    return;
  }

  // Fallback if the selector is not in HTML.
  if (!playlists.length) {
    alert("Create your first playlist!");
    openModal();
    return;
  }

  const choices = playlists.map(
    (p, i) => `${i + 1}. ${p.name}`
  ).join("\n");

  const answer = prompt(
    `Choose a playlist:\n${choices}`
  );

  if (answer === null) {
    songToSave = null;
    return;
  }

  const index = Number(answer) - 1;

  if (!Number.isInteger(index) || !playlists[index]) {
    alert("Invalid playlist number.");
    return;
  }

  const playlist = playlists[index];

  if (playlist.songs.some(
    s => s.trackId === song.trackId
  )) {
    alert("Song already saved!");
    return;
  }

  playlist.songs.push(song);

  save();
  renderUserPlaylists();

  songToSave = null;

  alert(`Added to ${playlist.name}!`);
}

// ================================
// PLAYLIST SELECTOR
// ================================

function renderPlaylistOptions() {
  const container = $("playlistOptions");
  if (!container || !songToSave) return;

  container.replaceChildren();

  if (!playlists.length) {
    container.textContent =
      "Create your first playlist!";
    return;
  }

  playlists.forEach(playlist => {
    const label = document.createElement("label");

    label.className =
      "flex items-center gap-4 bg-[#382d4c] " +
      "p-3 rounded-xl cursor-pointer";

    const icon = document.createElement("div");

    icon.className =
      "w-12 h-12 bg-purple-700 rounded-lg " +
      "flex items-center justify-center text-2xl";

    icon.textContent = "🎵";

    const name = document.createElement("span");
    name.className = "flex-1";
    name.textContent = playlist.name;

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.value = playlist.id;
    checkbox.className =
      "w-5 h-5 accent-purple-600";

    checkbox.checked = playlist.songs.some(
      song => song.trackId === songToSave.trackId
    );

    label.append(icon, name, checkbox);
    container.appendChild(label);
  });
}

function closeSaveModal() {
  $("saveSongModal").classList.add("hidden");
  songToSave = null;
}

if ($("saveSongModal")) {
  $("closeSaveModal").addEventListener(
    "click",
    closeSaveModal
  );

  $("confirmSaveSong").addEventListener(
    "click",
    () => {
      if (!songToSave) return;

      const selected = new Set(
        Array.from(
          $("playlistOptions").querySelectorAll(
            'input[type="checkbox"]:checked'
          )
        ).map(input => input.value)
      );

      playlists.forEach(playlist => {
        const exists = playlist.songs.some(
          song => song.trackId === songToSave.trackId
        );

        if (selected.has(playlist.id) && !exists) {
          playlist.songs.push(songToSave);
        }

        if (!selected.has(playlist.id) && exists) {
          playlist.songs = playlist.songs.filter(
            song => song.trackId !== songToSave.trackId
          );
        }
      });

      save();
      renderUserPlaylists();

      if (selectedPlaylist) {
        openUserPlaylist(selectedPlaylist);
      }

      closeSaveModal();
    }
  );

  $("newPlaylistFromSong").addEventListener(
    "click",
    () => {
      $("saveSongModal").classList.add("hidden");
      openModal();
    }
  );
}

// ================================
// REMOVE SONG
// ================================

function removeSong(trackId) {
  const playlist = playlists.find(
    p => p.id === selectedPlaylist
  );

  if (!playlist) return;

  playlist.songs = playlist.songs.filter(
    song => song.trackId !== trackId
  );

  save();
  renderUserPlaylists();
  openUserPlaylist(playlist.id);
}

// ================================
// MUSIC PLAYER
// ================================

function playSong(song) {
  if (!song.previewUrl) return;

  $("miniPlayer").classList.remove("hidden");

  $("playerCover").src =
    song.artworkUrl100 || "";

  $("playerTitle").textContent =
    song.trackName;

  $("playerArtist").textContent =
    song.artistName;

  const audio = $("audioPlayer");

  audio.src = song.previewUrl;

  audio.play().catch(console.error);
}

// ================================
// INITIALIZE
// ================================

renderUserPlaylists();
renderFeatured();