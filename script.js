const plantImage = document.getElementById("plantImage");
const preview = document.getElementById("preview");
const result = document.getElementById("result");

let model = null;

// Upload image
plantImage.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";

        result.innerHTML =
            "<h3>Image uploaded successfully</h3>" +
            "<p>Ready for AI analysis.</p>";
    }
});

// Load AI model
async function loadPlantModel() {
    if (!model) {
        result.textContent = "Loading PlantCare AI...";

        model = await tmImage.load(
            "./tm-my-image-model (3)/model.json",
            "./tm-my-image-model (3)/metadata.json"
        );
    }

    return model;
}

// Educational information for known categories
function getInformation(category) {
    const name = category.toLowerCase();

    if (name.includes("healthy")) {
        return {
            title: "Healthy Leaf Category",
            details: "The model classified this image in its healthy-leaf category.",
            care: "Continue regular plant observation and appropriate care."
        };
    }

    if (name.includes("early")) {
        return {
            title: "Early Blight Category",
            details: "Early blight is a fungal disease that can affect leaves.",
            care: "Observe affected areas and seek reliable agricultural guidance."
        };
    }

    if (name.includes("late")) {
        return {
            title: "Late Blight Category",
            details: "Late blight is a disease that can affect plant leaves and other parts.",
            care: "Seek agricultural guidance to confirm the condition."
        };
    }

    if (name.includes("septoria")) {
        return {
            title: "Septoria Leaf Spot Category",
            details: "Septoria leaf spot is a fungal disease associated with leaf spots.",
            care: "Monitor changes and consult a plant-health expert."
        };
    }

    if (name.includes("bacterial")) {
        return {
            title: "Bacterial Spot Category",
            details: "Bacterial spot can cause visible spots on leaves.",
            care: "Get the condition checked by a qualified agricultural expert."
        };
    }

    return {
        title: "Classification Result",
        details: "The AI assigned this image to the selected category.",
        care: "Verify the result before making plant-care decisions."
    };
}

// Analyse image
async function analyzePlant() {
    if (!plantImage.files[0]) {
        result.textContent = "Please upload an image first.";
        return;
    }

    try {
        result.innerHTML = "<h3>Analysing image...</h3>";

        const trainedModel = await loadPlantModel();
        const predictions = await trainedModel.predict(preview);

        predictions.sort(
            (a, b) => b.probability - a.probability
        );

        const best = predictions[0];
        const confidence = (best.probability * 100).toFixed(1);
        const info = getInformation(best.className);

        let html = `
            <div class="report-card">
                <h2>🌿 PlantCare AI Report</h2>

                <h3>${info.title}</h3>

                <p><strong>Predicted category:</strong>
                ${best.className}</p>

                <p><strong>Model confidence score:</strong>
                ${confidence}%</p>

                <hr>

                <h3>Category-wise Analysis</h3>
        `;

        predictions.forEach(function (item) {
            const percentage =
                (item.probability * 100).toFixed(1);

            html += `
                <div class="score-item">
                    <p>${item.className} — ${percentage}%</p>
                    <div class="progress-track">
                        <div class="progress-fill"
                        style="width:${percentage}%"></div>
                    </div>
                </div>
            `;
        });

        html += `
                <hr>
                <h3>About this category</h3>
                <p>${info.details}</p>

                <h3>General care guidance</h3>
                <p>${info.care}</p>

                <p class="warning">
                    Educational experiment only. These predictions
                    are not confirmed diagnoses. Please verify
                    results with a qualified agricultural expert.
                </p>

                <button onclick="downloadReport()">
                    Download Report
                </button>
            </div>
        `;

        result.innerHTML = html;

        window.lastPlantReport =
            "PLANTCARE AI REPORT\n\n" +
            "Predicted category: " + best.className +
            "\nModel confidence: " + confidence + "%" +
            "\n\nCategory scores:\n" +
            predictions.map(item =>
                item.className + ": " +
                (item.probability * 100).toFixed(1) + "%"
            ).join("\n") +
            "\n\n" + info.details +
            "\n\nCare guidance: " + info.care +
            "\n\nExperimental result, not a confirmed diagnosis.";

    } catch (error) {
        console.error(error);

        result.textContent =
            "Analysis failed. Please check the model files.";
    }
}

// Download report as text
function downloadReport() {
    if (!window.lastPlantReport) return;

    const blob = new Blob(
        [window.lastPlantReport],
        { type: "text/plain" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "PlantCare-AI-Report.txt";
    link.click();

    URL.revokeObjectURL(link.href);
}

// Robot monitoring demonstration
function startRobot() {
    document.getElementById("robotStatus").textContent =
        "Monitoring Demo Active";

    document.getElementById("health").textContent =
        "Waiting for image analysis";

    document.getElementById("moisture").textContent =
        "65% (Demo)";

    document.getElementById("temperature").textContent =
        "26°C (Demo)";
}

function stopRobot() {
    document.getElementById("robotStatus").textContent =
        "Monitoring Stopped";
}