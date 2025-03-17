const ecoPalVoice = document.getElementById("EcoPalVoice");
const ecoEnergyReply = document.getElementById("EcoEnergyReply");
const ecoRecycleReply = document.getElementById("EcoRecycleReply");
const ecoWaterReply = document.getElementById("EcoWaterReply");
const ecoClose = document.getElementById("EcoClose");

window.addEventListener("load", function () {
    const audio = document.getElementById("welcomeAudio");

    audio.play().catch(error => {
        console.log("Autoplay blocked. Waiting for user interaction...");
    });

    document.addEventListener("click", function playOnce() {
        audio.play();
        document.removeEventListener("click", playOnce);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const ecoPal = document.querySelector(".ecoPal");
    const chatBody = document.getElementById("chatBody");
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const openChat = document.getElementById("openChat");
    const closeChat = document.getElementById("closeChat");

    // Open and Close ecoPal
    openChat.addEventListener("click", function () {
        ecoPal.style.display = "block";
        openChat.style.display = "none";
        ecoPalVoice.play();

    });

    closeChat.addEventListener("click", function () {
        ecoPal.style.display = "none";
        openChat.style.display = "block";
        ecoClose.play();
    });


    // Function to add messages to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message", sender);

        if (sender === "bot") {
            const botAvatar = document.createElement("img");
            botAvatar.src = "./images/EcoPal.png";
            botAvatar.classList.add("chat-avatar");

            const messageText = document.createElement("span");
            messageText.textContent = text;

            messageDiv.appendChild(botAvatar);
            messageDiv.appendChild(messageText);
        } else {
            messageDiv.textContent = text;
        }

        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }


    // Basic ecoPal responses w/ voice
    function getBotResponse(message) {
        if (message.includes("recycle")) {
            ecoRecycleReply.play();
            return "♻️ Try sorting your waste into recyclables and non-recyclables!";
        } else if (message.includes("energy")) {
            ecoEnergyReply.play();
            return "⚡ Save energy by turning off unused lights and appliances!";
        } else if (message.includes("water")) {
            ecoWaterReply.play();
            return "💧 Save water by turning off the tap while brushing your teeth!";
        } else {
            return "🌱 I'm EcoPal! Ask me about recycling, energy, or sustainability!";
        }
    }

    // Send user msg
    sendBtn.addEventListener("click", function () {
        const userMessage = chatInput.value.trim();
        const checkMessage = chatInput.value.trim().toLowerCase();
        if (userMessage) {
            addMessage("You: " + userMessage, "user");

            setTimeout(function () {
                const botResponse = getBotResponse(checkMessage);
                addMessage(botResponse, "bot");
            }, 500);
        }
        chatInput.value = "";
    });

    // sending msgs with Enter key
    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendBtn.click();
        }
    });

    // ecoPals welcome msg
    addMessage("EcoPal: Hi! Ask me about eco-friendly tips!", "bot");
});


//API
async function calculateImpact() {
    const electricityUsed = document.getElementById("electricity").value;
    if (!electricityUsed || electricityUsed <= 0) {
        document.getElementById("result").textContent = "⚠️ Enter a valid number!";
        return;
    }

    try {
        const apiURL = "https://api.electricitymap.org/v3/carbon-intensity/latest?zone=US-NY-NYIS";
        const res = await fetch(apiURL, {
            method: "GET",
            headers: {
                "auth-token": 'YZtDa40XEI9p4ugT69VZ'
            }
        });
        const data = await res.json();

        if (data && data.carbonIntensity) {
            const co2Emissions = (electricityUsed * data.carbonIntensity).toFixed(2);
            document.getElementById("result").textContent = `🌍 CO₂ Emissions: ${co2Emissions} gCO₂`;
        } else {
            document.getElementById("result").textContent = "⚠️ No data available";
        }
    } catch (error) {
        document.getElementById("result").textContent = "⚠️ Error loading data";
        console.error("Error fetching data:", error);
    }
}