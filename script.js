const list = document.querySelector("#starred");
const status = document.querySelector("#status");

function updateStatus(message) {
  if (status) {
    status.textContent = message;
  }
}

function renderMessage(message) {
  if (!list) {
    return;
  }

  list.replaceChildren();
  const item = document.createElement("li");
  item.textContent = message;
  list.appendChild(item);
}

if (!list) {
  console.error("The starred repositories list could not be found.");
} else {
  list.setAttribute("aria-label", "Starred repositories");

  updateStatus("Loading starred repositories…");

  fetch("events.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load events (${response.status})`);
      }

      return response.json();
    })
    .then((events) => {
      list.replaceChildren();

      if (!Array.isArray(events) || events.length === 0) {
        renderMessage("No starred repositories recorded yet.");
        updateStatus("No starred repositories recorded yet.");
        return;
      }

      events.forEach((event) => {
        if (!event || typeof event.name !== "string" || typeof event.starred !== "string") {
          console.warn("Skipping invalid event entry", event);
          return;
        }

        const item = document.createElement("li");
        item.textContent = `${event.name} — starred ${event.starred}`;
        list.appendChild(item);
      });

      updateStatus(`Loaded ${events.length} starred repository entries.`);
    })
    .catch((error) => {
      console.error("Failed to load starred repositories", error);
      renderMessage("Unable to load starred repositories right now.");
      updateStatus("Unable to load starred repositories right now.");
    });
}